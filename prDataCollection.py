from datetime import datetime, timezone
from github import Github
import pandas as pd

def get_pr_data(github_client, org_name: str, start_date: datetime, end_date: datetime) -> pd.DataFrame:
    """
    Collect pull request data from all repositories in an organization
    
    FIXES:
    - Moved DataFrame creation outside the loop
    - Fixed indentation issues
    - Added proper error handling
    """
    org = github_client.get_organization(org_name)
    
    pr_records = []  # Initialize ONCE outside loop
    repos = org.get_repos()
    
    for repo in repos:
        try:
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
                    
        except Exception as e:
            print(f"Error processing repository {repo.name}: {e}")
            continue
    
    # Create DataFrame AFTER collecting all data
    if not pr_records:
        print("No PRs found in given date range")
        return pd.DataFrame()
    
    df = pd.DataFrame(pr_records)
    
    # Calculate average merge time
    merged_prs = df[df['merged_at'].notna()]
    avg_merge_time = merged_prs['time_to_merge_hours'].mean() if not merged_prs.empty else None
    df['avg_merge_time_hours'] = avg_merge_time
    
    print(f"Collected {len(df)} PRs from {len(df['repository'].unique())} repositories")
    print(f"   Average merge time: {avg_merge_time:.2f} hours" if avg_merge_time else "   No merged PRs")
    
    return df
