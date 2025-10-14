from datetime import datetime,timezone
import requests
import pandas as pd


def get_issue_data(github_client, org_name: str, start_date: str, end_date: str) -> pd.DataFrame:
    
    org = github_client.get_organization(org_name)
    
    issue_records = []
    repos = org.get_repos()
    for repo in repos:
        try:
            
            issues = repo.get_issues(state = "all", since = start_date)

            for issue in issues:
                if issue.pull_request is not None:
                    continue
                

         
                created_at = issue.created_at
                
               
                if start_date <= created_at <= end_date:
                    #if repo.name in include_list and repo.name not in exclude_list:
                        print(f"Collecting issues from repository: {repo.name}")
                        created_at = issue.created_at
                        closed_at = issue.closed_at

                        labels = [lbl.name for lbl in issue.labels]
                        is_blocked = any(lbl.lower() == "blocked" for lbl in labels)
                        is_bug = any(lbl.lower() == "bug" for lbl in labels)

                        issue_records.append({
                                'repository': repo.name,
                                'id': issue.id,
                                'number': issue.number,
                                'title': issue.title,
                                'user': issue.user.login if issue.user else None,
                                'state': issue.state,
                                'labels': labels,
                                'created_at': created_at,
                                'closed_at': closed_at,
                                'is_blocked': is_blocked,
                                'is_bug': is_bug
                        })
        except Exception as e:
            print(f"Error processing {repo.name}: {e}")
    #if repo.name in include_list and repo.name not in exclude_list:
        df = pd.DataFrame(issue_records)

        #ensuring df is not empty
        if df.empty:
            print("No issues found in given date range")
            return pd.DataFrame()
        
        #Manual metrics computation
        open_issues = df[df["state"] == "open"]
        closed_issues = df[df["state"] == "closed"]

        wip_count = len(open_issues[~open_issues["is_blocked"]])
        blocked_count = len(open_issues[open_issues["is_blocked"]])
        bug_closed = len(closed_issues[closed_issues["is_bug"]])
        defect_rate = bug_closed / len(closed_issues) if not closed_issues.empty else 0

        df["wip_issues"] = wip_count
        df["blocked_issues"] = blocked_count
        df["defect_rate"] = defect_rate

        return df



