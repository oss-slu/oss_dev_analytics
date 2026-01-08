
from flask import json

"""
Used to test how best to access data from the JSON file

"""
if __name__ == "__main__":

    filepath = 'test_data.json'
    with open(filepath, "r") as file:
        tempData = json.load(file)
    for key, value in tempData.items():
        print(f"Key: {key}")
        issues = tempData[key]["issues"]
        commits = tempData[key]["commits"]
        prs = tempData[key]["pull_requests"]
        total = 0
        for user, metrics in issues.items():
            total += issues[user]['total_issues_opened']
        print(total)
        