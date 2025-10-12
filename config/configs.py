import os
from dotenv import load_dotenv


#Getting API Token to be used in other files
load_dotenv()
GIT_TOKEN = os.getenv('GITHUB_TOKEN')