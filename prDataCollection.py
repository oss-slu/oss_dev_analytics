from datetime import datetime, timezone
from github import Github
import pandas as pd
from config import configs



def get_pr_data(github_client, org_name: str, start_date: str, end_date: str) -> pd.DataFrame:
    org = github_client.get_organization(org_name)
    #prob smth to do with grabbing the repositories, potentially have a check to see if it successfully grabs if not go ahead and rerun
    pr_records = []
    repos = org.get_repos()
    for repo in repos:
        try:
            
            prs = repo.get_pulls(state = "all", sort = "created", direction = "desc")
    
            for pr in prs:

                

                pr_created = pr.created_at
                
                if(start_date <= pr_created <= end_date):
                    #if repo.name in include_list:
                        print(f"PR Repository: {repo.name}")
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
    #if repo.name in include_list and repo.name not in exclude_list:
        df = pd.DataFrame(pr_records)
        if df.empty:
            print("No commits found in given date range") #maybe change to output into the file instead?
            return pd.DataFrame()
        merged_prs = df[df['merged_at'].notna()]
        avg_merge_time = merged_prs['time_to_merge_hours'].mean() if not merged_prs.empty else None
        df['avg_merge_time_hours'] = avg_merge_time
        return df