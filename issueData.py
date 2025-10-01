import requests

repo = f"https://api.github.com/repos/oss-slu/oss_dev_analytics/issues"

def get_issues(state="all", labels=None):
    params = {"state": state, "per_page": 100}
    if labels:
        params["labels"] = labels
    r = requests.get(repo, params=params)
    r.raise_for_status()
    return r.json()

def is_pr(issue):
    return "pull_request" in issue

def has_label(issue, name):
    name = name.lower().strip()
    return any(lbl.get("name", "").lower().strip() == name for lbl in issue.get("labels", []))

open_issues = [i for i in get_issues("open") if not is_pr(i)]
closed_issues = [i for i in get_issues("closed") if not is_pr(i)]

blocked_list = [i for i in open_issues if has_label(i, "blocked")]
wip_list = [i for i in open_issues if not has_label(i, "blocked")]

bug_closed = sum(1 for i in closed_issues if has_label(i, "bug"))

wip = len(wip_list)
blocked = len(blocked_list)

if (len(closed_issues) == 0):
    defect_rate = 0
else: 
    defect_rate = bug_closed / len(closed_issues)

print("📊 Metrics")
print("WIP Issues:", wip)
print("Blocked Issues:", blocked)
print("Defect Rate:", defect_rate)

