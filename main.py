from datetime import datetime, timezone
from github import Github, Auth
from config.configs import GIT_TOKEN, get_filtered_repositories, get_github_users
from prDataCollection import get_pr_data
from issueData import get_issue_data
import pandas as pd
from commits import get_commit_data
from config.configs import get_github_users
import json

def main():
    """
    Main function to collect and combine all metrics data
    
    FIXES:
    - Added error handling for empty DataFrames
    - Fixed column alignment logic
    - Added validation checks
    """
    # Initialize GitHub client
    g = Github(auth=Auth.Token(GIT_TOKEN))
    org_name = "oss-slu"
    
    # Define date range
    start_date = datetime(2025, 8, 1, tzinfo=timezone.utc)
    end_date = datetime(2025, 10, 27, tzinfo=timezone.utc)
    
    print(f"Collecting data for {org_name} from {start_date.date()} to {end_date.date()}")
    print("=" * 80)
    
    # Get filtered repositories (if needed)
    # include, exclude = get_filtered_repositories('config.ini')
    
    # Call the functions and get the data
    print("\n Collecting Commits...")
    df = get_commit_data(g, org_name, start_date, end_date)
    
    print("\n Collecting Pull Requests...")
    pr_df = get_pr_data(g, org_name, start_date, end_date)
    
    print("\n Collecting Issues...")
    issue_df = get_issue_data(g, org_name, start_date, end_date)
    
    print("\n" + "=" * 80)
    print("Data Collection Summary:")
    print(f"  Commits: {len(commit_df)}")
    print(f"  PRs: {len(pr_df)}")
    print(f"  Issues: {len(issue_df)}")
    
    # Check if we have any data
    if commit_df.empty and pr_df.empty and issue_df.empty:
        print("\n No data collected! Check your date range and organization access.")
        return
    
    # Add data_type column to each DataFrame
    if not commit_df.empty:
        commit_df["data_type"] = "commit"
    if not pr_df.empty:
        pr_df["data_type"] = "pull_request"
    if not issue_df.empty:
        issue_df["data_type"] = "issue"
    
    # Define shared columns for alignment
    shared_columns = [
        "repository", "user", "state", "created_at", "closed_at", "merged_at",
        "additions", "deletions", "files_changed", "message", "title", "velocity"
    ]
    
    def align_columns(df, shared_columns):
        """Align DataFrame columns to match shared schema"""
        if df.empty:
            return df
        
        # Add missing columns with NA values
        for col in shared_columns:
            if col not in df.columns:
                df[col] = pd.NA
        
        # Reorder columns: data_type first, then shared columns, then remaining
        remaining_cols = [c for c in df.columns if c not in shared_columns + ["data_type"]]
        ordered_cols = ["data_type"] + shared_columns + remaining_cols
        
        return df[ordered_cols]
    
    # Align all DataFrames
    print("\n Aligning columns...")
    commit_df = align_columns(commit_df, shared_columns)
    pr_df = align_columns(pr_df, shared_columns)
    issue_df = align_columns(issue_df, shared_columns)
    
    # Combine all DataFrames
    print(" Combining data...")
    dataframes_to_combine = []
    
    if not commit_df.empty:
        dataframes_to_combine.append(commit_df)
    if not pr_df.empty:
        dataframes_to_combine.append(pr_df)
    if not issue_df.empty:
        dataframes_to_combine.append(issue_df)
    
    if dataframes_to_combine:
        combined_df = pd.concat(dataframes_to_combine, ignore_index=True, sort=False)
        
        # Sort by repository, data type, and creation date
        combined_df = combined_df.sort_values(
            by=["repository", "data_type", "created_at"], 
            na_position="last"
        )
        
        # Save to CSV
        output_file = f'output_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        combined_df.to_csv(output_file, index=False)
        
        print(f"\n Data saved to: {output_file}")
        print(f"   Total records: {len(combined_df)}")
        print(f"   Repositories: {combined_df['repository'].nunique()}")
        
        # Display sample data
        print("\n Sample data (first 5 rows):")
        print(combined_df[['data_type', 'repository', 'user', 'created_at']].head())

        # Save to JSON
        repo_to_export = "oss_dev_analytics"
        repo_df = combined_df[combined_df['repository'] == repo_to_export]

        if repo_df.empty:
            print(f"No data for repo {repo_to_export}")
        else:
            sprints = ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5", "Sprint 6"]
            
            contributors, tech_leads = get_github_users(g, org_name, repo_to_export)
            
            output_json = {
                "org": org_name,
                "repo": repo_to_export,
                "sprints": sprints
            }

            def add_metrics(df, users, metric_name, prefix, sprint_dates, value_func):
                for user in users:
                    user_values = []
                    for start, end in sprint_dates:
                        sprint_df = df[(df['user'] == user) &
                                    (df['created_at'] >= start) & 
                                    (df['created_at'] <= end)]
                        if sprint_df.empty:
                            user_values.append(None)
                        else:
                            user_values.append(value_func(sprint_df))
                    key = f"{metric_name}-{prefix}-{user}"
                    output_json[key] = user_values

            sprint_ranges = [
                (datetime(2025, 9, 8, tzinfo=timezone.utc), datetime(2025, 9, 22, tzinfo=timezone.utc)),
                (datetime(2025, 9, 23, tzinfo=timezone.utc), datetime(2025, 10, 6, tzinfo=timezone.utc)),
                (datetime(2025, 10, 7, tzinfo=timezone.utc), datetime(2025, 10, 20, tzinfo=timezone.utc)),
                (datetime(2025, 10, 21, tzinfo=timezone.utc),    datetime(2025, 11, 3, tzinfo=timezone.utc)),
                (datetime(2025, 11, 4, tzinfo=timezone.utc), datetime(2025, 11, 17, tzinfo=timezone.utc)),
                (datetime(2025, 11, 18, tzinfo=timezone.utc), datetime(2025, 12, 1, tzinfo=timezone.utc)),]

            commits = repo_df[repo_df['data_type'] == 'commit']
            add_metrics(commits, contributors, "commitFrequency", "1", sprint_ranges,
                        lambda df: len(df))
            add_metrics(commits, contributors, "velocity", "1", sprint_ranges,
                        lambda df: float(df['velocity'].iloc[0]) if 'velocity' in df.columns else len(df)/max((end_date - start_date).days, 1))
            prs = repo_df[repo_df['data_type'] == 'pull_request']
            add_metrics(prs, contributors, "prTimeMerged", "1", sprint_ranges,
                        lambda df: float(df['avg_merge_time_hours'].iloc[0]) if 'avg_merge_time_hours' in df.columns else None)
            add_metrics(prs, contributors, "deliveryMetrics", "1", sprint_ranges, lambda df: len(df))
            issues = repo_df[repo_df['data_type'] == 'issue']
            add_metrics(issues, contributors, "leadTime", "1", sprint_ranges,
                        lambda df: df['avg_lead_time'].iloc[0] if 'avg_lead_time' in df.columns else None)
            add_metrics(issues, contributors, "cycleTime", "1", sprint_ranges,
                        lambda df: df['avg_cycle_time'].iloc[0] if 'avg_cycle_time' in df.columns else None)
            add_metrics(issues, contributors, "issuesOpened", "1", sprint_ranges, lambda df: len(df))
            add_metrics(issues, contributors, "issuesClosed", "1", sprint_ranges, lambda df: len(df[df['state']=='closed']))
            add_metrics(issues, contributors, "wip", "1", sprint_ranges, lambda df: len(df[(df['state']=='open') & (~df['is_blocked'])]))
            add_metrics(issues, contributors, "blockedIssues", "1", sprint_ranges, lambda df: len(df[(df['state']=='open') & (df['is_blocked'])]))
            add_metrics(issues, contributors, "defectRate", "1", sprint_ranges,
                        lambda df: float(len(df[(df['state']=='closed') & (df['is_bug'])]) / max(1, len(df[df['state']=='closed']))))
            add_metrics(issues, tech_leads, "leadTime", "tl", sprint_ranges,
                        lambda df: df['avg_lead_time'].iloc[0] if 'avg_lead_time' in df.columns else None)
            add_metrics(issues, tech_leads, "cycleTime", "tl", sprint_ranges,
                        lambda df: df['avg_cycle_time'].iloc[0] if 'avg_cycle_time' in df.columns else None)
            add_metrics(issues, tech_leads, "issuesOpened", "tl", sprint_ranges, lambda df: len(df))
            add_metrics(issues, tech_leads, "issuesClosed", "tl", sprint_ranges, lambda df: len(df[df['state']=='closed']))
            add_metrics(issues, tech_leads, "wip", "tl", sprint_ranges, lambda df: len(df[(df['state']=='open') & (~df['is_blocked'])]))
            add_metrics(issues, tech_leads, "blockedIssues", "tl", sprint_ranges, lambda df: len(df[(df['state']=='open') & (df['is_blocked'])]))
            add_metrics(issues, tech_leads, "defectRate", "tl", sprint_ranges,
                        lambda df: float(len(df[(df['state']=='closed') & (df['is_bug'])]) / max(1, len(df[df['state']=='closed']))))

            # Save JSON
            output_file = f"metrics_{repo_to_export}.json"
            with open(output_file, "w") as f:
                json.dump(output_json, f, indent=2)

            print(f"Per-user metrics JSON for {repo_to_export} saved to {output_file}")

            

        
    else:
        print("\n No data to combine!")
        
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
        
