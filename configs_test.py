from github import Github
from config.configs import GIT_TOKEN, get_github_users

# Create a Github client
g = Github(GIT_TOKEN)

# Test get_github_users for one repo
contributors, tech_leads = get_github_users(g, "oss-slu", "lrda_mobile")
print("Contributors:", contributors)
print("Tech Leads:", tech_leads)