import pandas as pd
from Backend.dataCollection.sprintFiltering import filter_data_by_sprint
from github import GithubException

def get_commit_data(g, repo_name, sprint = -1):
    """
    Fetches commit data from a GitHub repository within specified sprint dates.
    Args:
        g (Github): Authenticated Github client
        repo_name (str): Full repository name (e.g., "owner/repo")
        sprint (int): Sprint number to filter commits. Default is -1 (lifetime data)
    Returns:
        pd.DataFrame: DataFrame containing commit data with the following metrics:
            Metrics included in DataFrame:
            - Repository (string)
            - SHA (string)
            - Email (string) 
            - User (string)
            - Date Committed (dateTime)
            - Commit Message (string)
            - Velocity (int) #number of commits per day
    """
    try:
        repo = g.get_repo(repo_name)
        print(f"Commit Repository: {repo.name}") #debugging only

        commit_records = []
        seen_shas = set() #Track unique commits

        commits = repo.get_commits()
        commits_filtered = filter_data_by_sprint(commits, sprint)

        for commit in commits_filtered:
            try:
           
                # Skip if we've seen this SHA (avoid duplicates)
                if commit.sha in seen_shas:
                    continue
                seen_shas.add(commit.sha)

                # Get commit details
                author_name = commit.commit.author.name if commit.commit.author else None
                author_email = commit.commit.author.email if commit.commit.author else None
                commit_date = commit.commit.author.date
                #Get users Github username
                github_username = commit.author.login if commit.author else None

                commit_records.append({
                    'repository': repo.name,
                    'sha': commit.sha,
                    'author': author_name,
                    'email': author_email,
                    'user': github_username,  # GitHub username
                    'date': commit_date,
                    'message': commit.commit.message.strip()[:200],  # Truncate long messages
                })
        
            except Exception as commit_error:
                print(f"  Error processing commit {commit.sha}: {commit_error}")

        dataFrame = pd.DataFrame(commit_records) #dataframe to be returned
        #not for sure about this velocity calculation, thought is to count the number of commits per day and average it
        if dataFrame.empty:
            return dataFrame
        velocity = dataFrame.groupby(
            dataFrame['date'].dt.date
        ).size().mean() 
        
        dataFrame['velocity'] = velocity
    
        return dataFrame
    
    except GithubException as e:
        if e.status == 409:
            print(f"Repository {repo_name} is empty. Skipping commits")
            return pd.DataFrame()
        else:
            raise
    




