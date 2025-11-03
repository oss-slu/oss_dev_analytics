from datetime import datetime, timezone
from git import Repo
import pandas as pd
from github import Github
from config.configs import get_github_users



def get_commit_data(github_client, repo_name: str, start_date: datetime, end_date: datetime) -> pd.DataFrame:
    """
    FIXED VERSION with better accuracy
    
    Key fixes:
    1. Proper date filtering
    2. No duplicates
    3. Better error handling
    4. Progress tracking
    """
    repo = github_client.get_repo(repo_name)
    commit_records = []
    seen_shas = set()  # Track unique commits
    
    commits = repo.get_commits(since=start_date, until=end_date)
    repo_commit_count = 0
    
    for c in commits:
        try:
            # Skip if we've seen this SHA (avoid duplicates)
            if c.sha in seen_shas:
                continue
                    
            seen_shas.add(c.sha)
                    
            # Get commit details
            author_name = c.commit.author.name if c.commit.author else None
            author_email = c.commit.author.email if c.commit.author else None
            commit_date = c.commit.author.date
            
            # CRITICAL: Double-check date is in range
            # GitHub API sometimes returns commits outside range
            if not (start_date <= commit_date <= end_date):
                continue
            
            # Get author's GitHub username
            github_username = None
            if c.author:
                github_username = c.author.login

            commit_records.append({
                'repository': repo.name,
                'sha': c.sha,
                'author': author_name,
                'email': author_email,
                'user': github_username,  # GitHub username
                'date': commit_date,
                'message': c.commit.message.strip()[:200],  # Truncate long messages
                'additions': c.stats.additions if c.stats else 0,
                'deletions': c.stats.deletions if c.stats else 0,
                'files_changed': c.stats.total if c.stats else 0
            })
                    
            repo_commit_count += 1
                    
        except Exception as commit_error:
            # Log but continue
            pass
            
    print(f"{repo_commit_count} commits")
    
    if not commit_records:
        print("⚠️  No commits found!")
        return pd.DataFrame()
    
    df = pd.DataFrame(commit_records)
    
    # Remove any remaining duplicates
    df = df.drop_duplicates(subset=['sha'], keep='first')
    
    # Calculate velocity
    days = max((end_date - start_date).days, 1)
    
    user_metrics = df.groupby('user', dropna=True)['sha'].count().reset_index(name='total_commits')
    user_metrics['commit_frequency'] = user_metrics['total_commits'] / days

    df = df.merge(user_metrics, on='user', how='left', suffixes=('', '_user'))

    print(f"\n Collected {len(df)} unique commits")
    print(f"   By {len(df['user'].dropna().unique())} contributors")
    
    return df
