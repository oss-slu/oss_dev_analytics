import pandas as pd
from dataCollection.sprintFiltering import filter_data_by_sprint

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
    repo = g.get_repo(repo_name)
    commit_records = [] # temporary list to hold data
    print(f"Commit Repository: {repo.name}") #debugging only

    commits = repo.get_commits()
    commits_filtered = filter_data_by_sprint(commits, sprint)
    seen_shas = set() #Track unique commits

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
            github_username = None
            if commit.author:
                github_username = commit.author.login

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
    velocity = dataFrame.groupby(dataFrame['date'].dt.date).size().mean() if not dataFrame.empty else 0
    dataFrame['velocity'] = velocity
    return dataFrame
    




