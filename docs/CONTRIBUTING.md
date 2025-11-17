Contributing to OSS Metrics Dashboard
Thank you for your interest in contributing to the OSS Metrics Dashboard! This guide will help you get started with contributing to our project.
Project Vision
We're building a simple, automated metrics dashboard for GitHub organizations that helps engineering teams track agile metrics without complex infrastructure. Our goal is to make metrics collection as easy as running a Python script—no databases, no servers, just data.
How Can I Contribute?
Reporting Bugs
Found a bug? We want to hear about it! Before creating a bug report:

Check if the issue already exists in our issue tracker
Gather relevant information (OS, Python version, error messages)

Use our bug report template and include:

Clear description of the bug
Steps to reproduce
Expected vs. actual behavior
Your environment details
Any relevant logs or screenshots

Suggesting Features
Have an idea for a new metric or feature? Great! Create a feature request that includes:

Use case: Why would this be useful?
Proposed solution: How should it work?
Alternative approaches: Other options you considered
Impact: Who benefits from this feature?

Contributing Code
Good First Issues
New to the project? Look for issues labeled good first issue. These are:

Well-defined with clear acceptance criteria
Suitable for newcomers to the codebase
Have mentorship available from maintainers

Current Good First Issues:

Add loading spinner to dashboard
Add repository language filter
Improve error messages in config validation
Write unit tests for metrics calculations
Create troubleshooting documentation

Development Setup
Prerequisites:

Python 3.8 or higher
Git
GitHub Personal Access Token (with repo, read:org, read:user scopes)
Access to a GitHub organization for testing

Setup Steps:
bash# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/oss-metrics-dashboard.git
cd oss-metrics-dashboard

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up configuration
cp .env.example .env
# Edit .env with your GitHub token and test organization

# 5. Verify setup
python scripts/validate_config.py

# 6. Test data collection
python main.py
Common Setup Issues:

"No module named 'github'": Run pip install PyGithub
"GIT_TOKEN not found": Make sure .env file exists with GIT_TOKEN=your_token
"Organization not found": Verify you're a member of the organization

Development Workflow

Create a Branch

bash   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-123-description

Make Changes

Write clear, documented code
Follow existing code style
Add tests for new features
Update documentation as needed


Test Your Changes

bash   # Run data collection
   python main.py
   
   # Check output
   ls -la *.csv
   
   # View dashboard
   open dashboard/index.html

Commit Changes

bash   git add .
   git commit -m "feat: add user filtering to dashboard"
Commit Message Format:

feat: - New feature
fix: - Bug fix
docs: - Documentation only
test: - Adding or updating tests
refactor: - Code refactoring
style: - Code style changes


Push and Create PR

bash   git push origin feature/your-feature-name
Then create a Pull Request on GitHub.
Pull Request Guidelines
Your PR should:

Have a clear title and description
Reference related issues (e.g., "Closes #123")
Include tests for new functionality
Update relevant documentation
Pass all CI checks
Be focused on one feature/fix

PR Description Template:
markdown## Description
Brief description of what this PR does

## Related Issue
Closes #123

## Changes Made
- Added feature X
- Fixed bug Y
- Updated documentation

## Testing
- [ ] Tested locally with sample data
- [ ] Verified dashboard displays correctly
- [ ] Ran existing tests

## Screenshots (if applicable)
[Add screenshots for UI changes]
Improving Documentation
Documentation improvements are always welcome! You can:

Fix typos or unclear explanations
Add examples or use cases
Improve setup instructions
Create tutorials or how-to guides
Translate documentation

Code Style Guidelines
Python

Follow PEP 8
Use descriptive variable names
Add docstrings to functions
Maximum line length: 100 characters

Example:
pythondef calculate_velocity(commits_df: pd.DataFrame, sprint_days: int = 14) -> float:
    """
    Calculate sprint velocity from commits DataFrame
    
    Args:
        commits_df: DataFrame containing commit data
        sprint_days: Length of sprint in days (default: 14)
        
    Returns:
        Velocity as commits per day
    """
    total_commits = len(commits_df)
    return total_commits / sprint_days
JavaScript

Use ES6+ features
Consistent indentation (2 spaces)
Descriptive variable names
Add comments for complex logic

Testing Guidelines
We use pytest for testing. Tests go in the tests/ directory.
Running Tests:
bash# All tests
pytest

# Specific test file
pytest tests/test_metrics.py

# With coverage report
pytest --cov=scripts --cov-report=html
Writing Tests:
pythondef test_calculate_velocity():
    """Test velocity calculation with sample data"""
    sample_data = pd.DataFrame({
        'sha': ['abc123', 'def456'],
        'date': ['2025-01-01', '2025-01-02']
    })
    
    velocity = calculate_velocity(sample_data, sprint_days=2)
    assert velocity == 1.0  # 2 commits / 2 days = 1/day
Project Structure
oss-metrics-dashboard/
├── config/              # Configuration management
│   └── settings.py
├── scripts/             # Data collection and processing
│   ├── commits.py       # Commit data collection
│   ├── issueData.py     # Issue data collection
│   └── prDataCollection.py  # PR data collection
├── dashboard/           # HTML dashboard
│   ├── index.html
│   └── dashboard.js
├── data/               # Data storage
│   ├── manual/         # Manual CSV inputs
│   └── raw/            # Cached API data
├── tests/              # Unit tests
├── docs/               # Documentation
├── CONTRIBUTING.md     # This file
└── README.md           # Project overview
Issue Labels
We use these labels to organize work:

good first issue - Great for newcomers
help wanted - Community input needed
bug - Something isn't working
enhancement - New feature or request
documentation - Documentation improvements
question - Further information requested

Resources
Learning Resources

GitHub Flow Guide
Pandas Documentation
GitHub API Documentation

Project-Specific

Metrics Specification
Architecture Overview
Troubleshooting Guide

Code of Conduct
This project follows the Contributor Covenant Code of Conduct. By participating, you're expected to uphold this code. Report unacceptable behavior to [kasiviswanath.chilakala@slu.edu, daniel.shown@slu.edu].
Recognition
Contributors are recognized in several ways:

Listed in CONTRIBUTORS.md
Mentioned in release notes
GitHub contributors page
Special recognition for significant contributions

Getting Help
Stuck? Here's how to get help:

Check existing documentation (README, CONTRIBUTING, docs/)
Search closed issues for similar problems
Ask in GitHub Discussions
Comment on the issue you're working on
Create a new issue with your question

Response time: We aim to respond to questions within 48 hours.
What's Next?
Once your contribution is merged:

Star the repository to show support
Share the project with colleagues
Help triage incoming issues
Improve documentation
Tackle another issue!


Frequently Asked Questions
Q: How do I get a GitHub token?
A: Go to GitHub Settings → Tokens → Generate new token (classic) → Select repo, read:org, read:user scopes.
Q: Can I work on an issue that's not assigned?
A: Yes! Comment on the issue saying you'd like to work on it, and we'll assign it to you.
Q: How long should I wait for a review?
A: We aim to review PRs within 3-5 days. If you haven't heard back, comment on your PR to bump it.
Q: My PR was rejected. What now?
A: Don't be discouraged! Read the feedback, ask clarifying questions, and either update your PR or discuss alternative approaches.
Q: Can I work on something not in the issue tracker?
A: Yes, but create an issue first to discuss your idea. This ensures your work aligns with project goals.

Thank you for contributing to OSS Metrics Dashboard! Every contribution, no matter how small, helps make metrics accessible to more teams. 🎉
