from datetime import datetime, timezone
import requests
import pandas as pd

def get_issue_data(github_client, org_name: str, start_date: datetime, end_date: datetime) -> pd.DataFrame:
    """
    Collect issue data from all repositories in an organization
    
    FIXES:
    - Moved DataFrame creation outside the loop
    - Fixed indentation issues
    - Added proper error handling
    """
    org = github_client.get_organization(org_name)
    
    issue_records = []  # Initialize ONCE outside loop
    repos = org.get_repos()
    
    for repo in repos:
        try:
            print(f"Collecting issues from repository: {repo.name}")
            
            issues = repo.get_issues(state="all", since=start_date)
            
            for issue in issues:
                try:
                    # Skip pull requests
                    if issue.pull_request is not None:
                        continue
                    
                    created_at = issue.created_at
                    closed_at = issue.closed_at
                    labels = [lbl.name for lbl in issue.labels]

                    # Check if issue is within date range
                    if closed_at:
                        if closed_at < start_date:
                            continue
                    else:
                        if created_at > end_date:
                            continue
                    
                    # Get time that issue was first assigned
                    try:
                        for event in issue.get_events():
                            if event.event == "assigned":
                                assigned_time = event.created_at
                                break
                    except Exception:
                        assigned_time = None
                    
                    closed_at = issue.closed_at
                    is_blocked = any(lbl.lower() == "blocked" for lbl in labels)
                    is_bug = any(lbl.lower() == "bug" for lbl in labels)
                    
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
                        'is_blocked': is_blocked,
                        'is_bug': is_bug,
                        'assigned_time': assigned_time,
                    })
                except Exception as issue_error:
                    print(f"  Error processing issue #{issue.number}: {issue_error}")
                    continue
                    
        except Exception as e:
            print(f"Error processing repository {repo.name}: {e}")
            continue
    
    # Create DataFrame AFTER collecting all data
    if not issue_records:
        print("No issues found in given date range")
        return pd.DataFrame()
    
    df = pd.DataFrame(issue_records).drop_duplicates(subset=['id'])

    # Calculate metrics
    open_issues = df[df["state"] == "open"]
    closed_issues = df[df["state"] == "closed"]
    
    wip_count = len(open_issues[~open_issues["is_blocked"]])
    blocked_count = len(open_issues[open_issues["is_blocked"]])
    bug_closed = len(closed_issues[closed_issues["is_bug"]])
    defect_rate = bug_closed / len(closed_issues) if len(closed_issues) > 0 else 0
    
    user_metrics = df.groupby('user', dropna=True).apply(lambda x: pd.Series({
        'issues_opened': len(x),
        'issues_closed': len(x[x['state']=='closed']),
        'wip_issues': len(x[(x['state']=='open') & (~x['is_blocked'])]),
        'blocked_issues': len(x[(x['state']=='open') & (x['is_blocked'])]),
        'defect_rate': len(x[(x['state']=='closed') & (x['is_bug'])]) / max(1, len(x[x['state']=='closed'])),
        'avg_lead_time': (x['closed_at'] - x['created_at']).dt.total_seconds().mean() / 3600 if x['closed_at'].notna().any() else None,
        'avg_cycle_time': ((x['closed_at'] - x['assigned_time']).dt.total_seconds().mean() / 3600 
                        if x['assigned_time'].notna().any() and x['closed_at'].notna().any() else None)
    })).reset_index()

    df = df.merge(user_metrics, on='user', how='left', suffixes=('', '_user'))
    
    print(f" Collected {len(df)} issues from {len(df['repository'].unique())} repositories")
    print(f"   WIP: {wip_count}, Blocked: {blocked_count}, Defect Rate: {defect_rate:.2%}")
    
    return df