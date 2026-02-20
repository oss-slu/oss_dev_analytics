import pandas as pd
from Backend.dataCollection.sprintFiltering import filter_data_by_sprint


def get_issue_data(g, repo_name, sprint = -1):
    """
    Collect issue data from a repository within a sprint period.
    
    Args:
        g (Github): Authenticated GitHub client
        repo_name (str): Full repository name (e.g., "org/repo")
        sprint (int): Sprint number to filter issues, sprint dates in .env file
    Returns:
        pd.DataFrame: DataFrame containing issue data
            Metrics included in DataFrame:
            - Repository (string)
            - Issue ID (int)
            - Issue Number (int)
            - Title (string)
            - User (string)
            - State (open/closed) (string) #maybe change to bool?
            - Created At (dateTime)
            - Closed At (dateTime)
            - Labels (string)
            - Assigned At (dateTime) #for cycle time calculation
            - Time to Close (in hours) (float)
            - Issues Opened (int)
            - Issues Closed (int)
            - WIP Issues (int)
            - Blocked Issues (int)
    """
    repo = g.get_repo(repo_name)
    issue_records = [] # temporary list to hold data

    print(f"Issue Repository: {repo.name}") #debugging only
    issues = repo.get_issues(state="all", sort="created", direction="desc")
    #issues_filtered = filter_data_by_sprint(issues, sprint)
    if sprint == -1:
        issues_filtered = issues
    else:
        issues_filtered = filter_data_by_sprint(issues, sprint)
    for issue in issues_filtered:
        try:
            # Skip pull requests
            if issue.pull_request is not None:
                continue
            created_at = issue.created_at
            closed_at = issue.closed_at
            labels = [lbl.name for lbl in issue.labels]

            #Time to close calculation
            if closed_at:
                time_to_close = (closed_at - created_at).total_seconds() / 3600
            else:
                time_to_close = None
            assigned_time = None

            #Get info for Cycle time calculation
            # for event in issue.get_events():
                # if event.event == "assigned":
                   #  assigned_time = event.created_at
                    # break

            issue_records.append({
                'repository': repo.name,
                'id': issue.id,
                'number': issue.number,
                'title': issue.title,
                'user': issue.user.login if issue.user else None,
                'state': issue.state,
                'labels': ','.join(labels),  # Join labels as string
                'created_at': created_at,
                'closed_at': closed_at,
                'lead_time': time_to_close,
                'assigned_time': assigned_time
            })
        except Exception as issue_error:
            print(f"  Error processing issue #{issue.number}: {issue_error}")
            continue
    dataframe = pd.DataFrame(issue_records)
    if dataframe.empty or len(dataframe) == 0:
        return dataframe
    #calculating manual stats and adding to df
    issues_opened = len(dataframe)
    issues_closed = len(dataframe[dataframe['state'] == 'closed'])
    wip_issues = len(dataframe[(dataframe['state'] == 'open') & (~dataframe['labels'].str.contains('blocked', case=False))])
    dataframe['issues_opened'] = issues_opened
    dataframe['issues_closed'] = issues_closed
    dataframe['wip_issues'] = wip_issues
    #dataframe['cycle_time'] = dataframe.apply(
        #lambda row: (row['closed_at'] - row['assigned_time']).total_seconds() / 3600
        #if pd.notnull(row['closed_at']) and pd.notnull(row['assigned_time']) else None,
        #axis=1
    #)
    dataframe['cycle_time'] = None
    return dataframe


