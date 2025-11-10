from datetime import datetime, timezone
from github import Github, Auth
from config.configs import GIT_TOKEN, get_filtered_repositories, get_github_users
from prDataCollection import get_pr_data
from issueData import get_issue_data
import pandas as pd
from commits import get_commit_data
from config.configs import get_github_users
import json

def collect_sprint_metrics(github_client, repo_name, sprints, sprint_dates):
    metrics = {
        "org": "oss-slu",
        "repo": repo_name,
        "sprints": sprints
    }

    #github_users = get_github_users()
    contributors = ['hcaballero2', 'hollowtree11'] #github_users.get("contributors", [])
    tech_leads = ['viswanathreddy1017'] #github_users.get("tech_leads", [])

    all_users = contributors + tech_leads

    commit_metric_names = [
        "commitFrequency"
    ]

    issue_metric_names = [
        "issuesOpened", "issuesClosed", "wip", "blockedIssues", "defectRate",
        "leadTime", "cycleTime"
    ]

    pr_metric_names = [
        "prTimeMerged"
    ]

    all_metrics = commit_metric_names + issue_metric_names + pr_metric_names

    for user in all_users:
        for m in all_metrics:
            key = f"{m}_{user}" if user in contributors else f"{m}_{user}_tl"
            metrics[key] = []

    for (start, end) in sprint_dates:
        commits_data = get_commit_data(github_client, f"oss-slu/{repo_name}", start, end)
        issue_data = get_issue_data(github_client, f"oss-slu/{repo_name}", start, end)
        pr_data = get_pr_data(github_client, f"oss-slu/{repo_name}", start, end)

        if not commits_data.empty:
            sprint_df = commits_data.groupby("user", dropna=True).agg({
                "commitFrequency": "max"
            }).reset_index()
        else:
            sprint_df = pd.DataFrame(columns=["user"])

        issues_grouped = pd.DataFrame()
        if not issue_data.empty:
            issues_grouped = issue_data.groupby("user", dropna=True).agg({
                "issuesOpened": "max",
                "issuesClosed": "max",
                "wip": "max",
                "blockedIssues": "max",
                "defectRate": "max",
                "leadTime": "max",
                "cycleTime": "max"
            }).reset_index()
            sprint_df = pd.merge(sprint_df, issues_grouped, on="user", how="outer")
        
        if not pr_data.empty:
            pr_grouped = pr_data.groupby("user", dropna=True).agg({
                "prTimeMerged": "max"
            }).reset_index()
            sprint_df = pd.merge(sprint_df, pr_grouped, on="user", how="outer")

        if sprint_df.empty:
            sprint_df = pd.DataFrame(columns=["user"] + all_metrics)

        sprint_df = sprint_df.fillna(0)

        for user in all_users:
            user_row = sprint_df[sprint_df["user"] == user]
            for m in all_metrics:
                key = f"{m}_{user}" if user in contributors else f"{m}_{user}_tl"
                if not user_row.empty and m in user_row.columns:
                    val = float(user_row[m].values[0])
                else:
                    val = 0.0
                metrics[key].append(val)
    return metrics

def export_repositories_and_users():
    try:
        g = Github(GIT_TOKEN)
        repos = get_filtered_repositories("config/config.ini")

        output = {}
        for repo in repos:
            contributors, tech_leads = ['hollowtree11', 'hcaballero2'], ['viswanathreddy1017'] #get_github_users(g, "oss-slu", repo)
            tech_leads_formatted = [f"{u}_tl" for u in tech_leads]

            output[repo] = {
                "contributors": sorted(contributors),
                "tech_leads": sorted(tech_leads_formatted)
            }

            print(f"{repo}: {len(contributors)} contributors, {len(tech_leads_formatted)} tech leads")

        with open("oss_slu_repos.json", "w") as f:
            json.dump(output, f, indent=2)

        print("Exported repositories and users to oss_slu_repos.json")
    except Exception as e:
        print(f"Error exporting repositories and users: {e}")

if __name__ == "__main__":
    try:
        g = Github(GIT_TOKEN)

        sprints = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Sprint 6']

        sprint_dates = [
                (datetime(2025, 9, 8, tzinfo=timezone.utc), datetime(2025, 9, 22, tzinfo=timezone.utc)),
                (datetime(2025, 9, 23, tzinfo=timezone.utc), datetime(2025, 10, 6, tzinfo=timezone.utc)),
                (datetime(2025, 10, 7, tzinfo=timezone.utc), datetime(2025, 10, 20, tzinfo=timezone.utc)),
                (datetime(2025, 10, 21, tzinfo=timezone.utc),    datetime(2025, 11, 3, tzinfo=timezone.utc)),
                (datetime(2025, 11, 4, tzinfo=timezone.utc), datetime(2025, 11, 17, tzinfo=timezone.utc)),
                (datetime(2025, 11, 18, tzinfo=timezone.utc), datetime(2025, 12, 1, tzinfo=timezone.utc)),]

        repos = ['oss_dev_analytics']

        for repo in repos:
            json_data = collect_sprint_metrics(g, repo, sprints, sprint_dates)
            output_file = f"metrics_{repo}.json"
            with open(output_file, "w") as f:
                json.dump(json_data, f, indent=2)

        export_repositories_and_users()

    except Exception as e:
        print(f"\n Fatal error: {e}")
        import traceback
        traceback.print_exc()
        
