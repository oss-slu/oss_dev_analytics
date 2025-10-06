import requests

def get_issues(repo, state="all", labels=None):
    url = f"https://api.github.com/repos/oss-slu/{repo}/issues"
    params = {"state": state, "per_page": 100}
    if labels:
        params["labels"] = labels
    all_issues = []
    while url:
        r = requests.get(url, params=params)
        r.raise_for_status()
        data = r.json()
        all_issues.extend(data)
        url = r.links.get("next", {}).get("url")
    return [i for i in all_issues if "pull_request" not in i]

def is_pr(issue):
    return "pull_request" in issue

def has_label(issue, name):
    name = name.lower().strip()
    return any(lbl.get("name", "").lower().strip() == name for lbl in issue.get("labels", []))

def get_issue_data(repo):
    open_issues = [i for i in get_issues(repo, "open") if not is_pr(i)]
    closed_issues = [i for i in get_issues(repo, "closed") if not is_pr(i)]

    blocked_list = [i for i in open_issues if has_label(i, "blocked")]
    wip_list = [i for i in open_issues if not has_label(i, "blocked")]

    bug_closed = sum(1 for i in closed_issues if has_label(i, "bug"))

    wip = len(wip_list)
    blocked = len(blocked_list)

    if (len(closed_issues) == 0):
        defect_rate = 0
    else: 
        defect_rate = bug_closed / len(closed_issues)

    return {
        "issuesOpened": len(open_issues), 
        "issuesClosed": len(closed_issues), 
        "wip": wip, 
        "issuesBlocked": blocked, 
        "defectRate": defect_rate 
    }

"""
if __name__ == "__main__":
    test_repo = "lrda_website"
    data = get_issue_data(test_repo)
    print("Fetching Issue Data")
    print(f"WIP count: {data['wip']}")
    print(f"Blocked count: {data['issuesBlocked']}")
    print(f"Defect rate: {data['defectRate']:.2f}")
    print(f"Open issues: {data['issuesOpened']}")
    print(f"Closed issues: {data['issuesClosed']}")
    print("Test passed ✅")
"""
