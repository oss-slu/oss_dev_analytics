from datetime import datetime
from github import Github
import pandas as pd

github_token = "YOUR_GITHUB_TOKEN" 
g = Github(github_token)
org_name = "oss-slu"
org = g.get_organization(org_name)

#Time frame to filter PRs (sprint by sprint)
start_date = "2025-09-08"
end_date = "2025-09-22"

for repo in org.get_repos():
    print(f"Repository: {repo.name}")
    prs = repo.get_pulls(state="all", sort="created", direction="desc")
    pr_data = []
    
    for pr in prs:
        if pr.created_at >= datetime.fromisoformat(start_date) and pr.created_at <= datetime.fromisoformat(end_date): #checking to see if the PR's are in the sprint timeframe (remove if we want a wholelistic view of the repo)

            #Time to merge calculation
            if pr.merged_at:
                time_to_merge = (pr.merged_at - pr.created_at).total_seconds() / 3600
            else:
                time_to_merge = None
            pr_info = {
                'id': pr.id,
                'number': pr.number,
                'title': pr.title,
                'user': pr.user.login,
                'state': pr.state,
                'created_at': pr.created_at,
                'merged_at': pr.merged_at,
                'closed_at': pr.closed_at,
                'additions': pr.additions,
                'deletions': pr.deletions,
                'changed_files': pr.changed_files
            }
            pr_data.append(pr_info)
    
    # Create DataFrame
    prs_df = pd.DataFrame(pr_data)
    
    print(prs_df.head())  # Display first few PRs for the repository(just a check remove later)