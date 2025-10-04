from datetime import datetime
from git import Repo
import pandas as pd

#Change to API call to get repo info
#finding the repo
repo = Repo("C:/Users/hcaba/Desktop/Capstone/lrda_mobile")

#getting git commits
commits = repo.iter_commits('main')
commit_data = []
start_date = "2025-09-08"
end_date = "2025-09-22"

# Iterate over commits within time frame (sprint by sprint)
for commit in repo.iter_commits(since=start_date, until=end_date):
        commit_info = {
            'sha': commit.hexsha,
            'author': commit.author.name,
            'email': commit.author.email,
            'date': commit.committed_datetime,
            'message': commit.message.strip(),
            'additions': commit.stats.total['insertions'],
            'deletions': commit.stats.total['deletions'],
            'files_changed': commit.stats.total['files']
        }
        commit_data.append(commit_info)

#importing pandas to create dataframe and creating the df
commits_df = pd.DataFrame(commit_data)

#commits per author
contrib_counts = commits_df.groupby('author').size().reset_index(name='commits')

#velocity
days = (datetime.fromisoformat(end_date) - datetime.fromisoformat(start_date) or 1).days
velocity = len(commits_df) / days

#tags
tags = [(tag.name, tag.commit.committed_datetime) for tag in repo.tags]
tags_df = pd.DataFrame(tags, columns=['tag', 'date'])

#checking format of all dataframes
print("Commits DataFrame:", commits_df.head()) #having .head in case of a large df
print("\nContributors DataFrame: \n", contrib_counts)
print(f"\nVelocity: {velocity:.2f} commits/day")
print("\nTags DataFrame:\n", tags_df)

