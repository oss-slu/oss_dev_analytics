import os
from dotenv import load_dotenv
from pathlib import Path

# Explicitly load .env from project root
project_root = Path(__file__).resolve().parent.parent.parent
load_dotenv(project_root / ".env")

GIT_TOKEN = os.getenv("GIT_TOKEN")

if not GIT_TOKEN:
    raise ValueError("GIT_TOKEN not found! Please set it in .env file")