
# Welcome to OSS_Dev_Analytics
Welcome to the team! This project is dedicated to helping contributors understand the health and efficiency of open-source communities, specifically the Open Source with SLU (OSS-SLU) community. We transform raw GitHub data—Issues, Pull Requests, and Commits—into actionable insights.

## Project Architecture
The project is currently undergoing a refactor to move the frontend to a React site utilizing Vite. The backend remains a Python-based pipeline that processes data for visualization.

1. Data Collection & Preprocessing
Our backend uses a series of scripts to fetch and filter data:

* collectData.py: The main entry point for testing and running data collection across different repositories.

* sprintFiltering.py: Filters GitHub data based on specific two-week sprint windows for the 2026 calendar year.

* formatJSON.py: Aggregates the raw data into a structured JSON format, calculating metrics like average time to close/merge and commit velocity.

2. Key Metrics Tracked
We focus on three primary data streams:

* Pull Requests: Tracks status, additions, deletions, and Time to Merge (in hours).

* Issues: Measures Lead Time (creation to close) and Cycle Time (assignment to close).

* Commits: Tracks commit frequency and daily Velocity.

**Please see our [Coding Conventions](./CodingConventions.md) before contributing**

## Setup Instructions
### Prerequisites
* Python 3.x: Ensure you have a modern version of Python installed.
* Node.js: Required for the new React/Vite frontend.
* GitHub PAT: You will need a Personal Access Token for API authentication.

### Backend Configuration
Authentication: Ensure your GIT_TOKEN is configured in config/.env or your local environment.

Dependencies: You will need pandas and PyGithub to run the collection scripts.

Local Testing: You can run python collectData.py to generate a test JSON file (e.g., oss-slu_lrda_mobile.json) for the frontend to consume

### Automated Frontend and Backend Setup
To automatically download all necessary Python dependencies, run the following command in your terminal:

```bash
chmod +x setup.sh
./setup.sh
```
<<<<<<< HEAD
=======

>>>>>>> main
