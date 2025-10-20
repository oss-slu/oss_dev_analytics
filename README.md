# oss_dev_analytics

## Overview
OSS Dev Analytics is a data aggregation and analytics platform designed to collect, process, and visualize development metrics across all OSS SLU repositories. The system integrates data from Git repositories, issue trackers, and team surveys to produce a unified dashboard showing project health, velocity, and team satisfaction.

## System Architecture
The system consists of several key components:
- **Automated Data Collection**: Python scripts (`commits.py`, `issueData.py`, `prData.py`) extract raw data from GitHub APIs and store them as JSON/CSV.
- **Manual Data Collection**: Google Forms responses are exported as CSV for merging with Git metrics.
- **Processing Layer**: `main.py` aggregates data from all sources, calculates metrics, and formats results for visualization.
- **Dashboard**: A web-based frontend (HTML) visualizes metrics through charts and tables.

## Installation & Setup

### Prerequisites
- Python 3.10+
- GitHub API token (for accessing private repositories)
- `pandas`, `requests`, and `matplotlib` installed
  # Core dependencies
  * pandas>=1.5.0
  * requests>=2.28.0
  * gitpython>=3.1.0
  * python-dotenv>=0.19.0

  # Development dependencies
  * pytest>=7.0.0
  * pytest-cov>=4.0.0
  * black>=22.0.0
  * flake8>=5.0.0
### Installation
```bash
git clone https://github.com/oss-slu/oss_dev_analytics.git
cd oss_dev_analytics
pip install -r requirements.txt
```
## Metrics
* Git Logs
  * Lead Time
  * Cycle Time
  * Delivery Metrics
  * Commit Frequency (per author)
* Git Issues
  * Opened Frequency (per author)
  * closed Frequency (per author)
  * Resolution Time
  * PR (Merge Time)
  * WIP
* Surveys
  * Client Satisfaction
  * Team Satisfaction
  * Collaboration
  * Sprint Confidence
  * Goal Achievement

Sprint Velocity (Commits): Number of commits per sprint/week as a proxy for team productivity:
* Sprint 0 - 23 commits,
* Sprint 1 - 40 commits
Issues Opened/Closed (Sprint Basis): Track issue creation and resolution rates per sprint
* Expected Output:
    Sprint 1:
        Opened: 15 issues
        Closed: 12 issues
        Net : +3 issues (backlog growing)
    Sprint 2-
        Opened: 10 issues
        Closed: 14 issues
        Net: -3 issues ( Backlog shrinking)
Pull Requests (Opened/Merged/Closed): Track PR creation, merge rate, and average time to merge
* Expected output : 
  Sprint 1 - Created: 18 PRs, Merged: 15 PRs, Avg merge time: 2.3 days
  Sprint 2 - Created: 20 PRs, Merged: 19 PRs, Avg merge time: 1.8 days
Defect Rate (Bug Percentage): Percentage of issues that are bugs vs features
* Expected Output: 
  Sprint 1 - Total issues: 25,  Bugs: 8, Defect rate: 32% ,
  Sprint 2:# Total issues: 22# Bugs: 4# Defect rate: 18%
Work In Progress (Current State): Current open issues and PRs by type
* Expected Output: 
  Total WIP: 42 items
  Open Issues: 28
  Bugs: 8
  Features: 20
  Open PRs: 14
  In Review: 10
  Draft: 4
Repository Health Score: Composite score based on activity, quality, and maintenance
* Expected Output: 
  Repository: Repo1
  Health Score: 87/100 (Excellent)
  Recent Activity: 25/25 (last commit: 2 days ago)
  PR Merge Rate: 23/25 (92% merged)
  Issue Resolution: 20/25 (avg 4.2 days)
  Bug Rate: 19/25 (15% bugs)
Contributor Metrics (Per User): Individual developer contributions across all repos
* Expected Output: john_doe:
  Sprint Contributions:
    Sprint 1: 23 commits
    Sprint 2: 18 commits
    Sprint 3: 21 commits
  Total Contributions:
    Commits: 62
    Issues Created: 8
    Issues Closed: 12
    PRs Created: 15
    PRs Merged: 13
    Lines Added: 2,341
    Lines Deleted: 892
    Repositories: 4

      