from Backend.dataCollection.issue import get_issue_data
from Backend.dataCollection.pullRequest import get_pr_data
from Backend.dataCollection.commit import get_commit_data
from Backend.dataCollection.formatJSON import format_json_data

def collect_repository_data(g, repo_name, sprint=-1):
    """
    Collects and formats all repository data for a given sprint or lifetime mode
    """

    issue_data = get_issue_data(g, repo_name, sprint)
    pr_data = get_pr_data(g, repo_name, sprint)
    commit_data = get_commit_data(g, repo_name, sprint)

    raw_data = {
        "issues": issue_data.to_dict(orient="records"),
        "pull_requests": pr_data.to_dict(orient="records"),
        "commits": commit_data.to_dict(orient="records")
    }

    return format_json_data(raw_data, sprint)