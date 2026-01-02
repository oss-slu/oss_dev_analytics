
import pandas as pd


def format_json_data(raw_data, sprint = -1):
    """
    Formats the raw data collected from GitHub into a structured JSON format suitable for analytics.

    Parameters:
        raw_data (json): A json containing raw data for issues, pull requests, and commits. Separated by records
        sprint (int): Sprint number that data was filtered by, used to create charts easier. -1 is default (lifetime data)
    Returns: (maybe make into a void function that saves the json file rather than returning it)
        formatted_data (json): A json containing formatted data ready for analytics processing, separated by user AND records.
            Metrics each section includes:
                Issues:
                - Average Time to Close (in hours)
                - Total Issues Opened (int)
                - Total Issues Closed (int)
                - WIP Issues (int) ?????? maybe not include
                - Blocked Issues (int) ??? also maybe not include
                Pull Requests:
                    - Average Time to Merge (in hours)
                    - Total PRs Opened (int)
                    - Total PRs Merged (int)
                Commits:
                    - Total Commits (int)
                    - Average Velocity (float)
    """
    #Placeholder for formatted data
    formatted_data = {
        "sprint": sprint,
        "issues": {},
        "pull_requests": {},
        "commits": {}
    }

    #Process Issues
    issues_df = pd.DataFrame(raw_data['issues'])
    if not issues_df.empty: #maybe move this check to the collectData file to improve efficiency
        issues_grouped = issues_df.groupby('user')
        for user, group in issues_grouped:
            if 'bot' in str(user).lower():
                continue  #Skip bot users
            avg_time_to_close = group['lead_time'].mean()
            total_issues_opened = len(group)
            total_issues_closed = group['state'].value_counts().get('closed', 0)

            formatted_data['issues'][user] = {
                "average_time_to_close": avg_time_to_close,
                "total_issues_opened": total_issues_opened,
                "total_issues_closed": total_issues_closed
            }

    #Process Pull Requests
    prs_df = pd.DataFrame(raw_data['pull_requests'])
    if not prs_df.empty:
        prs_grouped = prs_df.groupby('user')
        for user, group in prs_grouped:
            if 'bot' in str(user).lower():
                continue  #Skip bot users
            avg_time_to_merge = group['time_to_merge'].mean()
            total_prs_opened = len(group)
            total_prs_merged = group['state'].value_counts().get('merged', 0)

            formatted_data['pull_requests'][user] = {
                "average_time_to_merge": avg_time_to_merge,
                "total_prs_opened": total_prs_opened,
                "total_prs_merged": total_prs_merged
            }

    #Process Commits
    commits_df = pd.DataFrame(raw_data['commits'])
    if not commits_df.empty:
        commits_grouped = commits_df.groupby('user')
        for user, group in commits_grouped:
            if 'bot' in str(user).lower():
                continue  #Skip bot users
            total_commits = len(group)
            avg_velocity = group['velocity'].mean()

            formatted_data['commits'][user] = {
                "total_commits": total_commits,
                "average_velocity": avg_velocity
            }

    return formatted_data