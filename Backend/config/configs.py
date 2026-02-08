from configparser import ConfigParser
import os
from dotenv import load_dotenv


#Getting API Token to be used in other files
load_dotenv()
GIT_TOKEN = os.getenv('GIT_TOKEN')

if not GIT_TOKEN:
    raise ValueError("GIT_TOKEN not found! Please set it in .env file")

