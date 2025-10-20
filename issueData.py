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
                    
                    # Check if issue is within date range
                    if not (start_date <= created_at <= end_date):
                        continue
                    
                    closed_at = issue.closed_at
                    labels = [lbl.name for lbl in issue.labels]
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
                        'is_bug': is_bug
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
    
    df = pd.DataFrame(issue_records)
    
    # Calculate metrics
    open_issues = df[df["state"] == "open"]
    closed_issues = df[df["state"] == "closed"]
    
    wip_count = len(open_issues[~open_issues["is_blocked"]])
    blocked_count = len(open_issues[open_issues["is_blocked"]])
    bug_closed = len(closed_issues[closed_issues["is_bug"]])
    defect_rate = bug_closed / len(closed_issues) if len(closed_issues) > 0 else 0
    
    # Add metrics as columns (same value for all rows)
    df["wip_issues"] = wip_count
    df["blocked_issues"] = blocked_count
    df["defect_rate"] = defect_rate
    
    print(f" Collected {len(df)} issues from {len(df['repository'].unique())} repositories")
    print(f"   WIP: {wip_count}, Blocked: {blocked_count}, Defect Rate: {defect_rate:.2%}")
    
    return df