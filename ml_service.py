"""AWWE experimental scarcity-risk ML API.

Trains only from the repository's daily hydrological CSV. Uses chronological
train/validation/test splits and compares a learned regressor with persistence
(last observed scarcity index) on a held-out future period.

This is research/demo software, not an operational warning service.
"""
from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.ensemble import ExtraTreesRegressor, RandomForestRegressor, HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

ROOT = Path(__file__).resolve().parent
DATA_PATH = Path(os.getenv("AWWE_DATA_CSV", ROOT / "madurai_daily_hydrological_timeseries.csv"))
TARGET = "scarcity_risk_index"
ID_COL = "tank_id"
DATE_COL = "date"
NUMERIC_FEATURES = [
    "rainfall_mm", "temperature_c", "humidity_pct", "evaporation_rate_mm",
    "inflow_cumecs", "current_water_level_m", "current_storage_mcm",
    "irrigation_outflow_cumecs", "spillway_discharge_cumecs",
    "groundwater_table_depth_m", "flood_risk_index", TARGET,
]

app = FastAPI(title="AWWE Experimental ML API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this to your deployed website origin for production.
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

_model = None
_evaluation: dict[str, Any] | None = None
_data: pd.DataFrame | None = None
_feature_columns: list[str] = []
_model_name = ""
_data_note = "Historical repository CSV; source data may be synthetic."


def _date_parse(series: pd.Series) -> pd.Series:
    return pd.to_datetime(series, dayfirst=False, errors="coerce")


def _load_frame() -> pd.DataFrame:
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found at {DATA_PATH}. Put "
            "'madurai_daily_hydrological_timeseries.csv' beside ml_service.py "
            "or set AWWE_DATA_CSV to its path."
        )
    frame = pd.read_csv(DATA_PATH)
    required = {ID_COL, DATE_COL, TARGET}
    missing = sorted(required - set(frame.columns))
    if missing:
        raise ValueError("CSV is missing required columns: " + ", ".join(missing))
    frame[DATE_COL] = _date_parse(frame[DATE_COL])
    frame = frame.dropna(subset=[ID_COL, DATE_COL, TARGET]).copy()
    frame[ID_COL] = frame[ID_COL].astype(str)
    frame = frame.sort_values([ID_COL, DATE_COL]).drop_duplicates([ID_COL, DATE_COL])
    return frame


def _make_supervised(frame: pd.DataFrame) -> tuple[pd.DataFrame, list[str]]:
    out = frame.copy()
    numeric = [c for c in NUMERIC_FEATURES if c in out.columns]
    for col in numeric:
        out[col] = pd.to_numeric(out[col], errors="coerce")
    # Inputs are observations available on day t; target is the recorded
    # scarcity index on day t+1. Shift is grouped per tank to avoid cross-tank leakage.
    for col in numeric:
        out[f"{col}_lag1"] = out.groupby(ID_COL)[col].shift(1)
        out[f"{col}_mean3"] = out.groupby(ID_COL)[col].transform(
            lambda s: s.shift(1).rolling(3, min_periods=1).mean()
        )
    out["day_of_year"] = out[DATE_COL].dt.dayofyear
    out["month"] = out[DATE_COL].dt.month
    out["target_next_day"] = out.groupby(ID_COL)[TARGET].shift(-1)
    # Baseline prediction at day t is persistence: today's target predicts tomorrow's.
    out["baseline_prediction"] = out[TARGET]
    features = numeric + [f"{c}_lag1" for c in numeric] + [f"{c}_mean3" for c in numeric] + ["day_of_year", "month"]
    out = out.replace([np.inf, -np.inf], np.nan)
    out = out.dropna(subset=["target_next_day", TARGET])
    return out, features


def _metrics(y_true: np.ndarray, y_pred: np.ndarray) -> dict[str, float]:
    return {
        "mae": round(float(mean_absolute_error(y_true, y_pred)), 6),
        "rmse": round(float(np.sqrt(mean_squared_error(y_true, y_pred))), 6),
        "r2": round(float(r2_score(y_true, y_pred)), 6) if len(y_true) > 1 else 0.0,
    }


def _fit() -> dict[str, Any]:
    global _model, _evaluation, _data, _feature_columns, _model_name
    frame = _load_frame()
    supervised, features = _make_supervised(frame)
    unique_dates = np.array(sorted(supervised[DATE_COL].dropna().unique()))
    if len(unique_dates) < 30:
        raise ValueError(f"Need at least 30 distinct dates for chronological evaluation; found {len(unique_dates)}.")
    train_cut = unique_dates[int(len(unique_dates) * 0.70)]
    val_cut = unique_dates[int(len(unique_dates) * 0.85)]
    train = supervised[supervised[DATE_COL] < train_cut]
    val = supervised[(supervised[DATE_COL] >= train_cut) & (supervised[DATE_COL] < val_cut)]
    test = supervised[supervised[DATE_COL] >= val_cut]
    if min(len(train), len(val), len(test)) == 0:
        raise ValueError("Chronological split produced an empty train, validation or test set.")

    # Fit imputers using training data only; medians are reused unchanged.
    medians = train[features].median(numeric_only=True).fillna(0)
    x_train = train[features].fillna(medians)
    x_val = val[features].fillna(medians)
    x_test = test[features].fillna(medians)
    y_train = train["target_next_day"].astype(float).to_numpy()
    y_val = val["target_next_day"].astype(float).to_numpy()
    y_test = test["target_next_day"].astype(float).to_numpy()

    candidates = {
        "Extra Trees": ExtraTreesRegressor(n_estimators=250, min_samples_leaf=3, random_state=42, n_jobs=-1),
        "Random Forest": RandomForestRegressor(n_estimators=250, min_samples_leaf=3, random_state=42, n_jobs=-1),
        "Histogram Gradient Boosting": HistGradientBoostingRegressor(max_iter=150, learning_rate=0.06, l2_regularization=1.0, random_state=42),
    }
    validation_scores = {}
    fitted = {}
    for name, candidate in candidates.items():
        candidate.fit(x_train, y_train)
        prediction = candidate.predict(x_val)
        fitted[name] = candidate
        validation_scores[name] = float(mean_absolute_error(y_val, prediction))
    _model_name = min(validation_scores, key=validation_scores.get)
    # Final selected model is refit on train + validation, never on the test set.
    train_val = supervised[supervised[DATE_COL] < val_cut]
    final_medians = train_val[features].median(numeric_only=True).fillna(0)
    final_model = candidates[_model_name]
    final_model.fit(train_val[features].fillna(final_medians), train_val["target_next_day"].astype(float))
    model_pred = final_model.predict(test[features].fillna(final_medians))
    baseline_pred = test["baseline_prediction"].astype(float).to_numpy()
    model_metrics = _metrics(y_test, model_pred)
    baseline_metrics = _metrics(y_test, baseline_pred)
    improvement = baseline_metrics["mae"] - model_metrics["mae"]
    beat_baseline = model_metrics["mae"] < baseline_metrics["mae"]
    test_rows = test[[DATE_COL, ID_COL, TARGET, "target_next_day"]].copy()
    test_rows["model_prediction"] = model_pred
    test_rows["baseline_prediction"] = baseline_pred
    sample = []
    for _, row in test_rows.tail(12).iterrows():
        sample.append({
            "date": row[DATE_COL].strftime("%Y-%m-%d"),
            "tank_id": str(row[ID_COL]),
            "observed_next_day_scarcity_index": round(float(row["target_next_day"]), 5),
            "ml_prediction": round(float(row["model_prediction"]), 5),
            "baseline_prediction": round(float(row["baseline_prediction"]), 5),
        })
    _model = final_model
    _feature_columns = features
    _data = frame
    _evaluation = {
        "status": "evaluated",
        "model_name": _model_name,
        "target": "next-day scarcity_risk_index",
        "dataset_file": DATA_PATH.name,
        "source_rows": int(len(frame)),
        "supervised_rows": int(len(supervised)),
        "tank_count": int(frame[ID_COL].nunique()),
        "first_date": frame[DATE_COL].min().strftime("%Y-%m-%d"),
        "last_date": frame[DATE_COL].max().strftime("%Y-%m-%d"),
        "train_period": {"start": train[DATE_COL].min().strftime("%Y-%m-%d"), "end": train[DATE_COL].max().strftime("%Y-%m-%d"), "rows": int(len(train))},
        "validation_period": {"start": val[DATE_COL].min().strftime("%Y-%m-%d"), "end": val[DATE_COL].max().strftime("%Y-%m-%d"), "rows": int(len(val))},
        "test_period": {"start": test[DATE_COL].min().strftime("%Y-%m-%d"), "end": test[DATE_COL].max().strftime("%Y-%m-%d"), "rows": int(len(test))},
        "validation_mae_by_model": {k: round(v, 6) for k, v in validation_scores.items()},
        "test_ml": model_metrics,
        "test_baseline": baseline_metrics,
        "mae_improvement": round(float(improvement), 6),
        "improvement_percent": round(float(100 * improvement / baseline_metrics["mae"]), 2) if baseline_metrics["mae"] else None,
        "beats_baseline": bool(beat_baseline),
        "interpretation": "ML beats persistence baseline on the chronological holdout." if beat_baseline else "ML does not beat persistence baseline on the chronological holdout. Do not claim model improvement.",
        "sample_predictions": sample,
        "experimental": True,
        "warning": "Historical/synthetic-data experiment only. Not an official warning; no real-world validation or live telemetry.",
    }
    return _evaluation


@app.on_event("startup")
def startup_train() -> None:
    try:
        _fit()
    except Exception as exc:
        # Keep the API alive so the dashboard can display a useful setup error.
        global _evaluation
        _evaluation = {"status": "not_ready", "error": str(exc), "experimental": True,
                       "warning": "ML has not been evaluated. Check dataset path and CSV schema."}


@app.get("/api/ml/status")
def status() -> dict[str, Any]:
    if _evaluation is None:
        try:
            return _fit()
        except Exception as exc:
            return {"status": "not_ready", "error": str(exc), "experimental": True}
    return _evaluation


@app.post("/api/ml/evaluate")
def evaluate() -> dict[str, Any]:
    try:
        return _fit()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.get("/api/ml/predict")
def predict(tank_id: str | None = Query(default=None)) -> dict[str, Any]:
    if _model is None or _data is None or _evaluation is None or _evaluation.get("status") != "evaluated":
        raise HTTPException(status_code=503, detail="Model is not ready. Check /api/ml/status.")
    frame = _data
    if tank_id:
        frame = frame[frame[ID_COL].astype(str) == tank_id]
        if frame.empty:
            raise HTTPException(status_code=404, detail=f"Unknown tank_id: {tank_id}")
    else:
        frame = frame.sort_values(DATE_COL).groupby(ID_COL, as_index=False).tail(1)
    supervised, features = _make_supervised(_data)
    latest = frame.sort_values(DATE_COL).groupby(ID_COL, as_index=False).tail(1).copy()
    numeric = [c for c in NUMERIC_FEATURES if c in latest.columns]
    for col in numeric:
        latest[col] = pd.to_numeric(latest[col], errors="coerce")
    for col in numeric:
        latest[f"{col}_lag1"] = _data.sort_values([ID_COL, DATE_COL]).groupby(ID_COL)[col].shift(1).reindex(latest.index)
        # Recreate a 3-observation historical mean ending before the latest observation.
        means = _data.sort_values([ID_COL, DATE_COL]).groupby(ID_COL)[col].transform(lambda s: s.shift(1).rolling(3, min_periods=1).mean())
        latest[f"{col}_mean3"] = means.reindex(latest.index)
    latest["day_of_year"] = latest[DATE_COL].dt.dayofyear
    latest["month"] = latest[DATE_COL].dt.month
    # First row for a tank has no lag; fill missing features with zeros only for this display endpoint.
    x = latest[features].replace([np.inf, -np.inf], np.nan).fillna(0)
    preds = _model.predict(x)
    items = []
    for (_, row), value in zip(latest.iterrows(), preds):
        items.append({"tank_id": str(row[ID_COL]), "last_observed_date": row[DATE_COL].strftime("%Y-%m-%d"),
                      "predicted_next_day_scarcity_index": round(float(value), 5),
                      "data_age_note": "This is extrapolated from the last historical row, not a current reading."})
    return {"status": "experimental_prediction", "items": items,
            "warning": "Historical/synthetic-data demo only; last observation may be stale. Not an official scarcity warning."}


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "AWWE Experimental ML API", "docs": "/docs", "status": "/api/ml/status"}
