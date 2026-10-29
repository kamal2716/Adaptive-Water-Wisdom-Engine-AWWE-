# AWWE Python ML Lab (experimental)

This service trains a next-day scarcity-index regression model from
`madurai_daily_hydrological_timeseries.csv`. It compares persistence, 3-day rolling
average and 7-day rolling average baselines. It uses a chronological 70% train /
15% validation / 15% test split. Model and baseline selection use validation MAE;
the final test period is not used for model selection or feature ablation.

## Run locally

1. Put `ml_service.py`, `requirements-ml.txt`, and
   `madurai_daily_hydrological_timeseries.csv` in the same folder.
2. Use Python 3.11 or 3.12.
3. In a terminal in that folder:

```bash
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements-ml.txt
uvicorn ml_service:app --reload --port 8000
```

4. Open http://127.0.0.1:8000/api/ml/status or http://127.0.0.1:8000/docs.
5. For a local website, serve the static site on a local HTTP server, then use
   the ML Lab panel's API URL `http://127.0.0.1:8000` and click **Connect / run**.

If the CSV is stored elsewhere, set `AWWE_DATA_CSV` to its full path before
starting the server. The service exposes `GET /api/ml/status`,
`POST /api/ml/evaluate`, and `GET /api/ml/predict?tank_id=TN_MDU_E001`.

## How evaluation works

- The target is the *next day's recorded* `scarcity_risk_index`.
- Features are numeric observations from the current day, lags, rolling means,
  and calendar month/day-of-year.
- The split is chronological; future dates are kept out of training.
- Candidate model selection uses validation MAE. Test MAE/RMSE/R² is reported
  alongside the persistence baseline.
- MAE lower than the validation-selected baseline means the model beats that
  baseline on this one holdout only; it does not prove real-world performance.
- The API reports test MAE/RMSE/R² for all three baselines and per-tank test metrics.
- Feature-group ablation is trained/evaluated on train/validation only. If removing
  a group worsens validation MAE, the group may add predictive signal; this is not
  causal proof.
- All chronological test predictions are returned for inspection; the dashboard
  summarizes performance for all tanks and shows representative predictions.
- The API returns the last available date's next-day extrapolation only as an
  experiment. With the repository data ending in 2025, that is stale and must
  not be treated as a forecast for current conditions.

## Important limitations

The dataset's scarcity index appears synthetic / unvalidated. Scores only
measure agreement with that index, not real-world water scarcity. There are no
ground-truth field observations, live sensors, validated thresholds, or water
quality labels here. This is not an official warning service. Restrict CORS to
your actual website origin before production deployment.
