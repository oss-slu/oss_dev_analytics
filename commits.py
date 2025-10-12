from datetime import datetime, timezone
from git import Repo
import pandas as pd
from github import Github


def get_commit_data(github_client, org_name: str, start_date: str, end_date: str, repo_name: str = None) -> pd.DataFrame:
    # Iterate over commits within time frame (sprint by sprint)
    org = github_client.get_organization(org_name)
    start_dt = datetime.fromisoformat(start_date).replace(tzinfo=timezone.utc)
    end_dt = datetime.fromisoformat(end_date).replace(tzinfo=timezone.utc)
    commit_records = []
    repos = [org.get_repo(repo_name)] if repo_name else org.get_repos()
    for repo in repos:
        try:
            print(f"Repository: {repo.name}")
            commits = repo.get_commits(since = start_dt, until = end_dt)
            commit_data = []

            for c in commits:
                    author_name = getattr(c.author, "name", None)
                    author_email = getattr(c.author, "email", None)

                    commit_date = c.commit.author.date
                    if commit_date.tzinfo is None:
                        commit_date = commit_date.replace(tzinfo=timezone.utc)

                    if not (start_dt <= commit_date <= end_dt):
                        continue
                    commit_records.append({
                        'repository': repo.name,
                        'sha': c.sha,
                        'author': author_name,
                        'email': author_email,
                        'date': c.commit.author.date,
                        'message': c.commit.message.strip(),
                        'additions': c.stats.additions if c.stats else 0,
                        'deletions': c.stats.deletions if c.stats else 0,
                        'files_changed': c.stats.total if c.stats else 0
                })
        except Exception as e:
             print(f"Error processing {repo.name}: {e}") #maybe change to output into the file instead?
    df = pd.DataFrame(commit_records)
    if df.empty:
         print("No commits found in given date range") #maybe change to output into the file instead?
         return pd.DataFrame()
    days = max((end_dt-start_dt).days, 1)
    df['velocity'] = len(df)/days
    return df

    

