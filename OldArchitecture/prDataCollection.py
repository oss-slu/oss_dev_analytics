from datetime import datetime, timezone
from github import Github
import pandas as pd

def get_pr_data(github_client, repo_name: str, start_date: datetime, end_date: datetime) -> pd.DataFrame:
    """
    Collect pull request data from all repositories in an organization
    
    FIXES:
    - Moved DataFrame creation outside the loop
    - Fixed indentation issues
    - Added proper error handling
    """
    repo = github_client.get_repo(repo_name)
    
    pr_records = []  # Initialize ONCE outside loop
    
    print(f"PR Repository: {repo.name}")
            
    prs = repo.get_pulls(state="all", sort="created", direction="desc")
    
    for pr in prs:
        try:
            pr_created = pr.created_at
            
            # Check if PR is within date range
            if not (start_date <= pr_created <= end_date):
                continue
            
            # Calculate time to merge
            if pr.merged_at:
                time_to_merge = (pr.merged_at - pr.created_at).total_seconds() / 3600
            else:
                time_to_merge = None
            
            pr_records.append({
                'repository': repo.name,
                'id': pr.id,
                'number': pr.number,
                'title': pr.title,
                'user': pr.user.login if pr.user else None,
                'state': pr.state,
                'created_at': pr.created_at,
                'merged_at': pr.merged_at,
                'closed_at': pr.closed_at,
                'additions': pr.additions,
                'deletions': pr.deletions,
                'changed_files': pr.changed_files,
                'time_to_merge_hours': time_to_merge
            })
        except Exception as pr_error:
            print(f"  Error processing PR #{pr.number}: {pr_error}")
            continue
    
    # Create DataFrame AFTER collecting all data
    if not pr_records:
        print("No PRs found in given date range")
        return pd.DataFrame()
    
    df = pd.DataFrame(pr_records)
    
    # Calculate average merge time
    merged_prs = df[df['merged_at'].notna()]
    prTimeMerged = merged_prs['time_to_merge_hours'].mean() if not merged_prs.empty else None

    user_avg_merge_time = merged_prs.groupby('user', dropna=True)['time_to_merge_hours'] \
                                .mean() \
                                .reset_index(name='prTimeMerged')
    
    df = df.merge(user_avg_merge_time, on='user', how='left')
    
    print(f"Collected {len(df)} PRs from {len(df['repository'].unique())} repositories")
    print(f"   Average merge time: {prTimeMerged:.2f} hours" if prTimeMerged else "   No merged PRs")
    
    return df

