from configparser import ConfigParser
import os
from dotenv import load_dotenv


#Getting API Token to be used in other files
load_dotenv()
GIT_TOKEN = os.getenv('GITHUB_TOKEN')

if not GIT_TOKEN:
    raise ValueError("GIT_TOKEN not found! Please set it in .env file")

#creating a function to filter repositories
#i did find this function online and the excluded repos doesn't completely make sense to me since its a list we have to enter anyway but i figure
#it is better to include it now and remove it later if need be
def get_filtered_repositories(config_file_path):
        config = ConfigParser()
        config.read(config_file_path)

        include_repos_str = config.get('REPOSITORIES', 'include', fallback='')
        exclude_repos_str = config.get('REPOSITORIES', 'exclude', fallback='')

        include_repos = [repo.strip() for repo in include_repos_str.split(',') if repo.strip()]
        exclude_repos = [repo.strip() for repo in exclude_repos_str.split(',') if repo.strip()]

        return include_repos, exclude_repos

def get_github_users(github_client, org_name: str, repo_name: str):
 
    org = github_client.get_organization(org_name)
    repo = org.get_repo(repo_name)

    contributors = set()
    tech_leads = set()

    try:
        for contributor in repo.get_contributors():
            if contributor and contributor.login:
                contributors.add(contributor.login)

        for pr in repo.get_pulls(state="all"):
            if pr.user and pr.user.login:
                contributors.add(pr.user.login)

        for issue in repo.get_issues(state="all"):
            if issue.user and issue.user.login:
                contributors.add(issue.user.login)

        for collaborator in repo.get_collaborators(permission="admin"):
            if collaborator and collaborator.login:
                tech_leads.add(collaborator.login)

        print(f"{repo_name}: Found {len(contributors)} contributors and {len(tech_leads)} tech leads")

        return sorted(list(contributors)), sorted(list(tech_leads))

    except Exception as e:
        print(f"Error fetching users for {repo_name}: {e}")
        return [], []
    