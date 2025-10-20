from datetime import datetime, timezone
from github import Github, Auth
from config.configs import GIT_TOKEN, get_filtered_repositories
'''from commits import get_commit_data'''
from prDataCollection import get_pr_data
from issueData import get_issue_data
import pandas as pd
from commits import get_commit_data

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
    end_date = datetime(2025, 10, 13, tzinfo=timezone.utc)
    
    print(f"Collecting data for {org_name} from {start_date.date()} to {end_date.date()}")
    print("=" * 80)
    
    # Get filtered repositories (if needed)
    # include, exclude = get_filtered_repositories('config.ini')
    
    # Call the functions and get the data
    print("\n Collecting Commits...")
    commit_df = get_commit_data(g, org_name, start_date, end_date)
    
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
        
    else:
        print("\n No data to combine!")
        

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n Fatal error: {e}")
        import traceback
        traceback.print_exc()
        
