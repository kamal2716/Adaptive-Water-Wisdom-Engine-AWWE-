# Adaptive Water Wisdom Engine (AWWE)

A responsive, cream-and-sage web prototype built around the project's source documents and Madurai tank/cascade datasets.

## Run it
Open [index.html](./index.html) in a browser, or serve the repository root with a static web server. No build step or framework is required. Google Fonts and Chart.js load from CDNs.

## Workspaces
- **Households:** PIN entry, local tank context, practical conservation guidance, supply and quality caveats, and flood/drought readiness.
- **Farmers:** tank storage context, a simple risk interpretation, and prioritised precautions for irrigation, drainage and water conservation.
- **Water authorities:** tank cascade overview, channel metadata and restoration signals, scenario comparison and review/approval workflow.
- **Trends & outlook:** illustrative charts and interactive hypothetical sliders.
- **Feedback & reports:** audience-tagged household/farmer reports, an authority inbox with audience filters, report status controls, direct replies, and PIN/eri selection from repository metadata. Reports and replies currently persist only for the active browser session.

## Source data and limitations
The existing project files (UKM project PDF, outline PDF, report DOCX and CSVs) are preserved unchanged. The UI uses tank metadata and channel network records and labels demo charts/values as illustrative; it does not claim live telemetry, a validated one-year forecast or an official public warning.

Tank storage does not prove a household has reliable treated supply. A production version should connect tank status to treatment facilities, distribution networks and official supply schedules; represent quantity separately from water quality; show timestamps and confidence; and never mark untested water safe to drink. Predictions and warnings need validation against local observations and official thresholds. Any proposed release, transfer or allocation must be reviewed and approved by authorized officials; this prototype does not control infrastructure.

## Suggested production architecture
- **Data:** ingest and validate `madurai_tank_master_metadata.csv`, `madurai_channel_cascade_network.csv`, the hydrological timeseries and joined records.
- **Models:** train/evaluate scikit-learn regressors or LightGBM with chronological holdouts, leakage checks and documented metrics. Clearly label synthetic Markov-chain scenarios as synthetic.
- **Service:** authenticated Python API for forecasts, data freshness, role-based access, advisories and a feedback audit trail.
- **UI:** extend the static HTML/CSS/JavaScript + Chart.js interface, or migrate to Streamlit/Dash; sliders here are conceptual, not operational controls.
- **Governance:** officials approve advisories and operational options. No direct automatic control of tank structures.

## Deployment
The root is a static site and can be deployed with GitHub Pages or a static hosting provider. Feedback reports and authority replies are session-only in this prototype; connect an authenticated server/database with role-based authorization and audit history before use beyond demonstration.
