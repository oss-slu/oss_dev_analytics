from github import Github
import pandas as pd
from Backend.dataCollection.sprintFiltering import filter_data_by_sprint

def get_pr_data(g, repo_name, sprint = -1):
    """
    Collect pull request data from a repository within a sprint period.
    
    Args:
        github_client: Authenticated GitHub client
        g (Github): Authenticated GitHub client
        repo_name (str): Full repository name (e.g., "org/repo")
        sprint (int): Sprint number to filter PRs, sprint dates in .env file
    Returns:
        pd.DataFrame: DataFrame containing pull request data
            Metrics included in DataFrame:
            - Repository
            - PR ID
            - PR Title
            - Number (PR number)
            - User
            - State (open/closed/merged)
            - Created At
            - Merged At
            - Closed at
            - Additions
            - Deletions
            - Changed Files (int)
            - Time to Merge (in hours)
            - Average Merge Time (in hours)
    """
    repo = g.get_repo(repo_name)
    pr_records = []
   # print(f"PR Repository: {repo.name}") debugging only

    #Get all PR's for the repo
    prs = repo.get_pulls(state="all", sort="created", direction="desc")
    pr_filtered = filter_data_by_sprint(prs, sprint)
    for pr in pr_filtered:
        
        #Time to merge calculation
        if pr.merged_at:
            time_to_merge = (pr.merged_at - pr.created_at).total_seconds() / 3600
        else:
            time_to_merge = None
        #add imporant info of pr to pr_records
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
                'time_to_merge': time_to_merge
            })
        #I removed the try and catch, add later if issues arise
    #Calculating average merge time
    dataframe = pd.DataFrame(pr_records)
    if dataframe.empty:
        return dataframe
    merged_prs = dataframe[dataframe['merged_at'].notna()]
    avg_merge_time = merged_prs['time_to_merge'].mean() if not merged_prs.empty else None
    dataframe['average_merge_time'] = avg_merge_time

    return dataframe