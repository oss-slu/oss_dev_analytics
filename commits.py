from datetime import datetime
from git import Repo
import pandas as pd
from github import Github


def get_commit_data(github_client, org_name: str, start_date: str, end_date: str, repo_name: str = None) -> pd.DataFrame:
    # Iterate over commits within time frame (sprint by sprint)
    org = github_client.get_organization(org_name)
    start_dt = datetime.formisoformat(start_date)
    end_dt = datetime.fromisoformat(end_date)
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
                    stats = c.stats.total if c.stats else{}
          
                    commit_records.append({
                        'repository': repo.name,
                        'sha': c.sha,
                        'author': author_name,
                        'email': author_email,
                        'date': c.commit.author.date,
                        'message': c.commit.message.strip(),
                        'additions': stats.total('insertions', 0),
                        'deletions': stats.total('deletions',0),
                        'files_changed': stats.total('files',0)
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

    

