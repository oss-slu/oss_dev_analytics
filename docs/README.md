# OSS_Dev_Analytics

Helping open-source contributors understand the health and efficiency of their communities through data-driven insights.

## Overview
OSS_Dev_Analytics provides a centralized dashboard for the **Open Source with SLU** community. We transform raw GitHub activity into actionable metrics, helping maintainers and contributors identify bottlenecks and celebrate progress.

## Tech Stack
* **Backend:** Python 3.x, Pandas (Data processing), PyGithub (GitHub API Wrapper).
* **Frontend:** React.js, Vite, Tailwind CSS.
* **Data Pipeline:** Sprint-based filtering and JSON-structured analytics.

## Project Architecture
- **Data Acquisition:** Python scripts fetch data from GitHub via the REST API.
- **Sprint Filtering:** Activity is categorized into predefined two-week sprints.
- **Preprocessing:** Pandas is used to calculate "Time to Merge," "Lead Time," and "Velocity."
- **Visualization:** A React + Vite frontend consumes the processed JSON to render interactive charts.

## Dynamic Health Score Calculation
We implemented a dynamic health scoring system that adapts to each repository's selected metrics instead of using a fixed formula

### How it works
- Each repository defines a set of metrics to track
- Only those selected metrics are used in the calculation
- Metric values are normalized (0-100 scale)
- A weighted average is computed based on selected metrics

### Formula
Health Score = Σ(metric × weight) / Σ(weights)

### Example
If a repository selects:
- issue_resolution = 80
- commit_volume = 60
Then:
Health Score = (80×0.25 + 60×0.20) / (0.25 + 0.20)

### Edge Cases
- If no metrics are selected -> an error is returned
- If some metric values are missing -> they are ignored
- If no valid data is available -> an error is returned

### Note
Currently, metric selection is simulated using a temporary in-memory configuration (fake database). 
This will later be replaced with database/Okta-based user configurations.

## 🤝 Getting Started
Are you interested in contributing to our organization-wide analytics?
1. Check out our [Onboarding Document](./Onboarding.md).
2. Join the conversation in the **#oss-dev-analytics** Slack channel.
3. Look for "Good First Issues" in our repository!

### Communication:

All communication is held via the 

OSS_Dev_Analytics Slack group chat: https://oss-slu.slack.com/archives/C09C1AQ181L

 and 

OS SLU Slack: 
