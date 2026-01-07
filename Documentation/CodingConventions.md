## General Principles
* Consistency: Follow the established patterns for data processing and visualization.
* Readability: Write code that is easy for future SLU students to understand and maintain.
* Modularity: Keep backend logic (data collection) separate from frontend logic (visualization).

## Python (Backend) Guidelines
The backend focuses on data acquisition from GitHub and preprocessing into JSON formats.

### Coding Standards
* Naming Conventions: Use snake_case for all functions and variables (e.g., get_pr_data, issue_records).
* Exception Handling: Wrap API calls in try-except blocks to handle network or permission errors gracefully.

### Function Documentation (Python)
Every backend function must include a docstring following this format:
```
def get_pr_data(g, repo_name, sprint = -1):
    """
    Collect pull request data from a repository within a sprint period.
    Args:
        g (Github): Authenticated GitHub client.
        repo_name (str): Full repository name.
        sprint (int): Sprint number to filter data.
    Returns:
        pd.DataFrame: DataFrame containing PR metrics.
    """
```
### Metric Definitions
To ensure data accuracy, developers must use the following established calculations:

* Time to Merge: Calculated as (merged_at - created_at) in total hours.
* Time to Close (Lead Time): Calculated as (closed_at - created_at) in total hours.
* Cycle Time: Calculated as (closed_at - assigned_time) in total hours.
* Velocity: The mean number of commits per day based on unique SHAs.

## React & Vite (Frontend) Guidelines
The frontend refactor utilizes Vite for fast builds and Tailwind CSS for styling.

### Component Architecture
* Naming Conventions: Use PascalCase for component files and function names (e.g., SprintDashboard.jsx).
* Functional Components: Use arrow functions for all React components.
* Props Over State: Prefer passing data through props to keep components reusable for different repositories or sprints.

Tailwind CSS: Use utility classes directly in className rather than writing external CSS files.
### File Structure
    ```
    frontend/src/
    ├── app/             # Core setup: App.jsx, Provider.jsx, Router.jsx
    ├── components/      # Global reusable UI
    │   ├── charts/      # Generic chart wrappers (e.g., VolumeBased.jsx)
    │   └── NavBar.jsx   # Global navigation
    ├── features/        # Business logic grouped by domain
    │   ├── home/        # Home page routes and specific logic
    │   └── team-stats/  # Team-specific analytics and routes
    ├── utils/           # Shared formatting and calculation helpers
    ├── main.jsx         # Application entry point
    └── index.css        # Global Tailwind/Base styles
    ```
### Frontend Documentation Guidelines
 * To be determined in more depth at a later time, in the meantime follow the following general rules
 * Follow a similar function documentation style to the Backend 
    * Inside React use 
    ```
    /*
        Comments here
    */
    ```
    * Inside JSX
    ```
    {/* Comments here */}
    ```




