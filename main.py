from github import Github
from config.configs import GIT_TOKEN 
from commits import get_commit_data
from prDataCollection import get_pr_data
from issueData import get_issue_data
import pandas as pd

def main():
    g = Github(GIT_TOKEN)
    org_name = "oss-slu"
    start_date = "2025-09-22"
    end_date = "2025-10-06"

    #call the functions and get the data
    commit_df = get_commit_data(g, org_name, start_date, end_date)
    pr_df = get_pr_data(g, org_name, start_date, end_date)
    issue_df = get_issue_data(g, org_name, start_date, end_date)

    commit_df["data_type"] = "commit"
    pr_df["data_type"] = "pull_request"
    issue_df["data_type"] = "issue"


    shared_columns = [
    "repository", "user", "state", "created_at", "closed_at", "merged_at",
    "additions", "deletions", "files_changed", "message", "title", "velocity"
    ]   
    def align_columns(df, shared_columns):
        for col in shared_columns:
            if col not in df.columns:
                df[col] = pd.NA
        return df[["data_type"] + shared_columns + [c for c in df.columns if c not in shared_columns + ["data_type"]]]

    commit_df = align_columns(commit_df, shared_columns)
    pr_df = align_columns(pr_df, shared_columns)
    issue_df = align_columns(issue_df, shared_columns)


    combined_df = pd.concat([commit_df, pr_df, issue_df], ignore_index=True, sort=False)


    combined_df = combined_df.sort_values(by=["repository", "data_type", "created_at"], na_position="last")

    #combining df
    analytics_df = pd.concat([commit_df,pr_df,issue_df], axis = 0, ignore_index=True)
    analytics_df.to_csv('output.csv', index=False)
    print(analytics_df.head())
if __name__ == "__main__":
    main()