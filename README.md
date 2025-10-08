# oss_dev_analytics

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

      


## Useful Links:

https://oss-augur.readthedocs.io/en/main/development-guide/installation.html
- Local Augur installation, necessary in order to edit Augur so it does not require the database

https://oss-augur.readthedocs.io/en/main/development-guide/create-a-metric/api-development.html
-  Goes over current CHAOSS metrics so we know what we have and what we need to develop

https://oss-augur.readthedocs.io/en/main/development-guide/create-a-metric/metrics-steps.html
- If we want to create our own metric rather than just use what CHAOSS has this will be important
