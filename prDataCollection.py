from datetime import datetime
from github import Github
import pandas as pd
from config import configs


github_token = configs.GIT_TOKEN
g = Github(github_token)
org_name = "oss-slu"
org = g.get_organization(org_name)

#Time frame to filter PRs (sprint by sprint)
start_date = "2025-09-08"
end_date = "2025-09-22"
def get_pr_data(github_client, org_name: str, start_date: str, end_date: str, repo_name: str = None) -> pd.DataFrame:
    org = github_client.get_organization(org_name)
    start_dt = datetime.formisoformat(start_date)
    end_dt = datetime.fromisoformat(end_date)
    pr_records = []
    repos = [org.get_repo(repo_name)] if repo_name else org.get_repos()
    for repo in org.get_repos():
        try:
            prs = repo.get_pulls(state = "all", sort = "created", direction = "desc")
    
            for pr in prs:
                if pr.created_at >= datetime.fromisoformat(start_date) and pr.created_at <= datetime.fromisoformat(end_date): #checking to see if the PR's are in the sprint timeframe (remove if we want a wholelistic view of the repo)

                    #Time to merge calculation
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
        except Exception as e:
            print(f"Error processing {repo.name}: {e}") #maybe change to output into the file instead?
    df = pd.DataFrame(pr_records)
    if df.empty:
         print("No commits found in given date range") #maybe change to output into the file instead?
         return pd.DataFrame()
    merged_prs = df[df['merged_at'].notna()]
    avg_merge_time = merged_prs['time_to_merge_hours'].mean() if not merged_prs.empty else None
    df['avg_merge_time_hours'] = avg_merge_time
    return df