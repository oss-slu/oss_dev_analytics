from datetime import datetime, timezone
from github import Github, Auth
from config.configs import GIT_TOKEN, get_github_users
from prDataCollection import get_pr_data
from issueData import get_issue_data
from commits import get_commit_data
import pandas as pd
import json

# Initialize GitHub client
g = Github(auth=Auth.Token(GIT_TOKEN))

def main():
    org_name = "oss-slu"
    target_repo = "oss_dev_analytics"
    full_repo = f"{org_name}/{target_repo}"

    # Date range for data collection
    start_date = datetime(2025, 8, 1, tzinfo=timezone.utc)
    end_date = datetime(2025, 12, 1, tzinfo=timezone.utc)

    print(f"Collecting data for {full_repo} from {start_date.date()} to {end_date.date()}")
    print("=" * 80)

    # Fetch raw data
    commit_df = get_commit_data(g, full_repo, start_date, end_date)
    pr_df = get_pr_data(g, full_repo, start_date, end_date)
    issue_df = get_issue_data(g, full_repo, start_date, end_date)

    print(f"Commits: {len(commit_df)}, PRs: {len(pr_df)}, Issues: {len(issue_df)}")

    # Add data_type column
    for df, typ in [(commit_df, "commit"), (pr_df, "pull_request"), (issue_df, "issue")]:
        if not df.empty:
            df["data_type"] = typ
    
    # CRITICAL FIX: Rename 'date' to 'created_at' for commits
    if not commit_df.empty:
        if 'date' in commit_df.columns and 'created_at' not in commit_df.columns:
            commit_df['created_at'] = pd.to_datetime(commit_df['date'])
            print("✅ Standardized commit dates: 'date' → 'created_at'")
        elif 'created_at' in commit_df.columns:
            commit_df['created_at'] = pd.to_datetime(commit_df['created_at'])
    
    # Ensure created_at is datetime for all dataframes
    for df in [pr_df, issue_df]:
        if not df.empty and 'created_at' in df.columns:
            df['created_at'] = pd.to_datetime(df['created_at'])

    # Combine all data
    combined_df = pd.concat([df for df in [commit_df, pr_df, issue_df] if not df.empty], ignore_index=True)
    repo_df = combined_df[combined_df["repository"] == target_repo]

    if repo_df.empty:
        print("No data found for this repo!")
        return

    # Sprint date ranges (6 sprints, 14 days each)
    sprint_ranges = [
        (datetime(2025, 9,  8, tzinfo=timezone.utc), datetime(2025,  9, 22, 23, 59, 59, tzinfo=timezone.utc)),
        (datetime(2025, 9, 23, tzinfo=timezone.utc), datetime(2025, 10,  6, 23, 59, 59, tzinfo=timezone.utc)),
        (datetime(2025,10,  7, tzinfo=timezone.utc), datetime(2025, 10, 20, 23, 59, 59, tzinfo=timezone.utc)),
        (datetime(2025,10, 21, tzinfo=timezone.utc), datetime(2025, 11,  3, 23, 59, 59, tzinfo=timezone.utc)),
        (datetime(2025,11,  4, tzinfo=timezone.utc), datetime(2025, 11, 17, 23, 59, 59, tzinfo=timezone.utc)),
        (datetime(2025,11, 18, tzinfo=timezone.utc), datetime(2025, 12,  1, 23, 59, 59, tzinfo=timezone.utc)),
    ]

    # Get contributors and tech leads
    contributors, tech_leads = get_github_users(g, org_name, target_repo)
    
    # CRITICAL FIX: Remove duplicates between contributors and tech_leads
    # If someone is a tech lead, remove them from contributors
    contributors = [c for c in contributors if c not in tech_leads]
    
    all_users = contributors + tech_leads
    print(f"Found {len(contributors)} contributors + {len(tech_leads)} tech leads")

    # Initialize output
    output_json = {
        "org": org_name,
        "repo": target_repo,
        "sprints": [f"Sprint {i+1}" for i in range(6)]
    }

    # Helper: calculate average days between two datetime columns
    def avg_days(df, start_col, end_col):
        if df.empty or start_col not in df.columns or end_col not in df.columns:
            return None
        valid = df[[start_col, end_col]].dropna()
        if valid.empty:
            return None
        delta = (valid[end_col] - valid[start_col]).dt.total_seconds().mean()
        return round(delta / 86400, 2)

    # Split data by type
    commits_df = repo_df[repo_df["data_type"] == "commit"]
    prs_df = repo_df[repo_df["data_type"] == "pull_request"]
    issues_df = repo_df[repo_df["data_type"] == "issue"]
    issues_prs_df = pd.concat([issues_df, prs_df], ignore_index=True)

    # === PER USER + PER SPRINT METRICS ===
    total_commits_in_sprints = 0
    
    for user in all_users:
        prefix = "tl-" if user in tech_leads else "1-"
        
        # Filter data for this user
        user_commits = commits_df[commits_df["user"] == user]
        user_issues = issues_df[issues_df["user"] == user]
        user_prs = prs_df[prs_df["user"] == user]

        # Commit Frequency (total commits per sprint)
        commit_freq = []
        user_sprint_total = 0
        
        for sprint_idx, (start, end) in enumerate(sprint_ranges):
            sprint_commits = user_commits[
                (user_commits["created_at"] >= start) & 
                (user_commits["created_at"] <= end)
            ]
            count = len(sprint_commits)
            commit_freq.append(count)
            user_sprint_total += count
            
        if user_sprint_total > 0:
            print(f"📊 {user} ({prefix[:-1]}): {user_sprint_total} commits → {commit_freq}")
        
        total_commits_in_sprints += user_sprint_total
        output_json[f"commitFrequency-{prefix}{user}"] = commit_freq

        # Lead Time: created → closed (issues + PRs)
        lead_times = []
        for start, end in sprint_ranges:
            sprint_items = issues_prs_df[
                (issues_prs_df["user"] == user) &
                (issues_prs_df["created_at"] >= start) &
                (issues_prs_df["created_at"] <= end)
            ]
            lead_times.append(avg_days(sprint_items, "created_at", "closed_at"))
        output_json[f"leadTime-{prefix}{user}"] = lead_times

        # Cycle Time: use PR merge time (best proxy)
        cycle_times = []
        for start, end in sprint_ranges:
            sprint_prs = user_prs[
                (user_prs["created_at"] >= start) &
                (user_prs["created_at"] <= end)
            ]
            cycle_times.append(avg_days(sprint_prs, "created_at", "merged_at"))
        output_json[f"cycleTime-{prefix}{user}"] = cycle_times

        # PR Time to Merge
        output_json[f"prTimeMerged-{prefix}{user}"] = [
            avg_days(user_prs[
                (user_prs["created_at"] >= start) &
                (user_prs["created_at"] <= end)
            ], "created_at", "merged_at")
            for start, end in sprint_ranges
        ]

        # Issues Opened / Closed / WIP
        output_json[f"issuesOpened-{prefix}{user}"] = [
            len(user_issues[(user_issues["created_at"] >= start) & (user_issues["created_at"] <= end)])
            for start, end in sprint_ranges
        ]
        output_json[f"issuesClosed-{prefix}{user}"] = [
            len(user_issues[(user_issues["created_at"] >= start) & (user_issues["created_at"] <= end) & (user_issues["state"] == "closed")])
            for start, end in sprint_ranges
        ]
        output_json[f"wip-{prefix}{user}"] = [
            len(user_issues[(user_issues["created_at"] >= start) & (user_issues["created_at"] <= end) & (user_issues["state"] == "open")])
            for start, end in sprint_ranges
        ]

    print(f"\n" + "=" * 80)
    print(f"📈 SUMMARY:")
    print(f"   Total commits collected: {len(commits_df)}")
    print(f"   Commits within sprint ranges: {total_commits_in_sprints}")
    print("=" * 80)

    # Save metrics file
    metrics_file = f"metrics_{target_repo}.json"
    with open(metrics_file, "w") as f:
        json.dump(output_json, f, indent=2, default=str)
    print(f"\n✅ {metrics_file} → SAVED")

    # Save repo list for dashboard
    repos_data = {
        target_repo: {
            "contributors": sorted(contributors),
            "tech_leads": [f"{u}_tl" for u in sorted(tech_leads)]
        }
    }
    with open("oss_slu_repos.json", "w") as f:
        json.dump(repos_data, f, indent=2)
    print("✅ oss_slu_repos.json → SAVED")

    print("\n" + "=" * 80)
    print("🚀 DASHBOARD READY!")
    print("   Run: python -m http.server 8000")
    print("   Then open: http://localhost:8000/metrics.html")
    print("=" * 80)

if __name__ == "__main__":
    main()