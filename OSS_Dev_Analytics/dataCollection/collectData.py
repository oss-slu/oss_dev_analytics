from github import Github, Auth
from dataCollection.formatJSON import format_json_data
from config.configs import GIT_TOKEN
from dataCollection.pullRequest import get_pr_data
from dataCollection.issue import get_issue_data
from dataCollection.commit import get_commit_data
import pandas as pd
import json

def test_pr_data():
    repo_name = "oss-slu/oss_dev_analytics"
    g = Github(auth=Auth.Token(GIT_TOKEN))
    sprint = -1
    pr_data = get_pr_data(g, repo_name, sprint)
    print(pr_data.head())
    return pr_data
def test_issue_data():
    repo_name = "oss-slu/oss_dev_analytics"
    g = Github(auth=Auth.Token(GIT_TOKEN))
    sprint = -1
    issue_data = get_issue_data(g, repo_name, sprint)
    with pd.option_context('display.max_rows', None, 'display.max_columns', None): #just want to make sure the df looks correct
        print(issue_data)
    return issue_data
def test_commit_data():
    repo_name = "oss-slu/oss_dev_analytics"
    g = Github(auth=Auth.Token(GIT_TOKEN))
    sprint = -1
    commit_data = get_commit_data(g, repo_name, sprint)
    with pd.option_context('display.max_rows', None, 'display.max_columns', None): #just want to make sure the df looks correct
        print(commit_data)
    return commit_data
if __name__ == "__main__":
   df1 = test_issue_data()
   df2 = test_pr_data()
   df3 = test_commit_data()
   out = { 
       "issues": df1.to_dict(orient='records'),
       "pull_requests": df2.to_dict(orient='records'),
       "commits": df3.to_dict(orient='records')
   }
   #now send the temp .json to a function that puts it into the format we need to show analytics
   formatted = format_json_data(out)
   with open("test_data.json", "w") as outfile:
       json.dump(formatted, outfile, indent=4, default=str)
