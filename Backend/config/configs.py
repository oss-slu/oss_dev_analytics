from configparser import ConfigParser
import os
from dotenv import load_dotenv
from pathlib import Path

# having issues finding the .env file when doing local testing, according to my research this should not impact the actions
env_path = Path(__file__).parent / ".env"
#Getting API Token to be used in other files
load_dotenv()
GIT_TOKEN = os.getenv('GIT_TOKEN')

if not GIT_TOKEN:
    raise ValueError("GIT_TOKEN not found! Please set it in .env file")

