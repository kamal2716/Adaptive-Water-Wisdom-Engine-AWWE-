# Adaptive Water Wisdom Engine (AWWE)

A responsive, cream-and-sage web prototype built around the project's source documents and Madurai tank/cascade datasets.

## Run it
Serve the repository root with GitHub Pages or a local static web server for the most reliable experience. The app first loads the CSV files from the site and then tries the repository's raw CSV URLs as a fallback, so direct `file://` opening may work when the browser permits cross-origin requests and the internet is available; use a web server if your browser blocks it. No build step or framework is required. Google Fonts and Chart.js load from CDNs.

## Workspaces
- **Households:** PIN entry, local tank context, practical conservation guidance, supply and quality caveats, and flood/drought readiness.
- **Farmers:** tank storage context, a simple risk interpretation, and prioritised precautions for irrigation, drainage and water conservation.
- **Water authorities:** organised city-level KPIs, clickable tank register, selected-tank operating snapshot, historical hydrology/risk charts, and all channel links sourced directly from `madurai_channel_cascade_network.csv`.
- **Trends & outlook:** daily historical rainfall and storage charts loaded from `madurai_daily_hydrological_timeseries.csv`; charts start with the full available year selected and include From month / To month filters plus a Full year reset. Hypothetical scenario sliders remain illustrative.
- **Feedback & reports:** audience-tagged household/farmer reports, an authority inbox with audience filters, report status controls, timestamped multi-reply history, tank-specific submissions, browser-persistent storage, and CSV/PDF export options.

- **Feedback records:** reports now persist in browser `localStorage` across reloads on the same browser, retain tank ID/name and category, and support multiple timestamped authority replies per report. Each workspace can print/save the current report view as PDF. The CSV export creates a one-row-per-report register with tank details, problem, status, and all replies grouped in one cell.
- **Trends PDF:** each workspace's Trends & outlook page offers Print / Save as PDF. The print view includes the selected tank, selected month range, chart, and monthly rainfall/storage summary table; the default range is the full year 2025.
- **Authority tank view:** all 12 repository tanks are shown as clickable relative-position markers based on their stored coordinates, with a complete tank index for selection. This is a schematic overview, not a navigation map.


## Source data and limitations
The existing project files (UKM project PDF, outline PDF, report DOCX and CSVs) are preserved unchanged. Tank names, PINs, coordinates, capacity, dead storage, full reservoir level, siltation and sluice-gate counts are loaded from `madurai_tank_master_metadata.csv`. Daily storage, level, rainfall, inflow, irrigation outflow, spillway discharge, groundwater depth, evaporation and risk-index values are loaded from `madurai_daily_hydrological_timeseries.csv`. Channel links, designed/effective capacity, encroachment, siltation labels, structural-integrity scores and restoration-priority scores are loaded directly from `madurai_channel_cascade_network.csv`; channel values are not duplicated as hardcoded app data. The dataset is historical (currently through 31 December 2025), not live telemetry; it does not provide a validated one-year forecast or official public warning. The selected-tank usable-water figure is a transparent estimate (recorded storage minus listed dead storage, floored at zero), not a verified release volume. Risk indices are shown as raw historical values only; their definitions, scale, thresholds and validation must be confirmed before any real warning use. Confirm units and definitions for evaporation and infrastructure scores with the dataset owner before operational interpretation.

Reports and replies are stored in this browser's local storage, not in a shared database. The CSV button downloads a snapshot; it does not write changes back into the repository or synchronize users on different devices. For shared real-time reporting, connect an authenticated backend/database and use server-side authorization.

Tank storage does not prove a household has reliable treated supply. A production version should connect tank status to treatment facilities, distribution networks and official supply schedules; represent quantity separately from water quality; show timestamps and confidence; and never mark untested water safe to drink. Predictions and warnings need validation against local observations and official thresholds. Any proposed release, transfer or allocation must be reviewed and approved by authorized officials; this prototype does not control infrastructure.

## Suggested production architecture
- **Data:** ingest and validate `madurai_tank_master_metadata.csv`, `madurai_channel_cascade_network.csv`, the hydrological timeseries and joined records.
- **Models:** train/evaluate scikit-learn regressors or LightGBM with chronological holdouts, leakage checks and documented metrics. Clearly label synthetic Markov-chain scenarios as synthetic.
- **Service:** authenticated Python API for forecasts, data freshness, role-based access, advisories and a feedback audit trail.
- **UI:** extend the static HTML/CSS/JavaScript + Chart.js interface, or migrate to Streamlit/Dash; sliders here are conceptual, not operational controls.
- **Governance:** officials approve advisories and operational options. No direct automatic control of tank structures.

## Deployment
The root is a static site and can be deployed with GitHub Pages or a static hosting provider. Feedback reports and authority replies are session-only in this prototype; connect an authenticated server/database with role-based authorization and audit history before use beyond demonstration.
