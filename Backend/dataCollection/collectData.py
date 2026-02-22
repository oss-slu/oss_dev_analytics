import os
import json
import argparse
from datetime import datetime
from github import Github, Auth
from Backend.config.configs import GIT_TOKEN
from Backend.dataCollection.repositoryCollector import collect_repository_data


# This function checks which sprint is currently active
# It reads the sprint_schedule_json file and compares
# today's date with the start and end dates
def get_current_sprint():
    try:
        with open("data/sprint_schedule.json", "r") as file:
            schedule = json.load(file)
        
        today = datetime.today().date()

        for semester in schedule:
            for sprint in schedule[semester]:
                start = datetime.strptime(
                    sprint["start"], "%Y-%m-%d"
                ).date()
                end = datetime.strptime(
                    sprint["end"], "%Y-%m-%d"
                ).date()

                # If today is inside the sprint window,
                # return that sprint number
                if start <= today <= end:
                    return sprint["sprint"]
                
        # If no sprint matches, return None
        return None
    
    except Exception as e:
        print(f"Error reading sprint schedule: {e}")
        return None

# Collect data for one repository
# sprint = -1 means lifetime mode (full history)
# Any other sprint number means sprint-only data
def other_repo(repo, sprint=-1):
    repo_name = "oss-slu/" + repo
    g = Github(auth=Auth.Token(GIT_TOKEN))

    # Delegating all repository-level collection to dataCollection layer
    formatted = collect_repository_data(g, repo_name, sprint)

    # Deciding which file to write to
    # Lifetime data goes into lifetime_data.json
    # Sprint data goes into sprint_data.json
    path = (
        "data/lifetime_data.json"
        if sprint == -1
        else "data/sprint_data.json"
    )

    # Making sure the data folder exists
    os.makedirs("data", exist_ok=True)

    # If file does not exist yet, create it
    if not os.path.exists(path):
        with open(path, "w") as outfile:
            json.dump({}, outfile)

    # Loading existing data
    with open(path, "r") as outfile:
        data = json.load(outfile)

    # Using repo name as key for lifetime data
    # For sprint mode, include sprint number in the key
    key = repo if sprint == -1 else f"{repo}_sprint_{sprint}"
    data[key] = formatted

    # Writing updated data back to file
    with open(path, "w") as outfile:
        json.dump(data, outfile, indent=4, default=str)

# This is the entry point when the workflow runs the script
# The workflow passes either --mode lifetime or --mode sprint
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--mode",
        choices=["lifetime", "sprint"],
        required=True
    )
    args = parser.parse_args()

    repos = ["lrda_mobile", "oss_dev_analytics"]
    
    if args.mode == "lifetime":
        # Run fill history collection
        for repo in repos:
            other_repo(repo, -1)

    elif args.mode == "sprint":
        # First check which sprint is active
        sprint = get_current_sprint()

        if sprint is None:
            # If we are outside sprint dates, do nothing
            print("No active sprint found")
        else:
            for repo in repos:
                other_repo(repo, sprint)