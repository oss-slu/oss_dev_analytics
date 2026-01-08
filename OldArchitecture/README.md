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

## 🤝 Getting Started
Are you interested in contributing to our organization-wide analytics?
1. Check out our [Onboarding Document](./Onboarding.md).
2. Join the conversation in the **#oss-dev-analytics** Slack channel.
    * https://oss-slu.slack.com/archives/C09C1AQ181L
3. Look for "Good First Issues" in our repository!
