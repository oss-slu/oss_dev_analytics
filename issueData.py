import requests

repo = f"https://api.github.com/repos/oss-slu/oss_dev_analytics/issues"

def get_issues(state="all", labels=None):
    params = {"state": state, "per_page": 100}
    if labels:
        params["labels"] = labels
    r = requests.get(repo, params=params)
    r.raise_for_status()
    return r.json()

open_issues = get_issues("open")
wip = len(open_issues)

blocked_issues = get_issues("open", "blocked")
blocked = len(blocked_issues)

bug_issues = get_issues("all", "bug")
bug_closed = sum(1 for i in bug_issues if i["state"] == "closed")

closed_issues = get_issues("closed")
if (len(closed_issues) == 0):
    defect_rate = 0
else: 
    defect_rate = bug_closed / len(closed_issues)

print("📊 Metrics")
print("WIP Issues:", wip)
print("Blocked Issues:", blocked)
print("Defect Rate:", defect_rate)