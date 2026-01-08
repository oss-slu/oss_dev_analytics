/**
 * Transforms raw JSON data into a format suitable for VolumeCharts.
 * Handles Organization, Repository, and User levels.
 * @param {Object} rawData - The JSON object from your project.
 * @param {string} filterType - 'org', 'repo', or 'user'. (Default is Org)
 * @param {string|null} selection - The specific user or repo name if filterType is not 'org'. (Default null)
 * @returns {Object} A flat object with keys for Issues, PRs, and Commits.
 */
export const transformVolumeData = (rawData, filterType = 'org', selection = null) => {
    if (!rawData) return null;

    //User-Level Logic
    if (filterType === 'user' && selection) {
        return {
            "Issues Opened": parseInt(rawData.issues[selection]?.total_issues_opened || 0),
            "Issues Closed": parseInt(rawData.issues[selection]?.total_issues_closed || 0),
            "PRs Opened": rawData.pull_requests[selection]?.total_prs_opened || 0,
            "Commits": rawData.commits[selection]?.total_commits || 0
        };
    }

    //Repo-Level and Org-Level Logic (Averaging across users)
    const userKeys = Object.keys(rawData.commits); 
    const count = userKeys.length;

    const totals = userKeys.reduce((acc, user) => {
        acc.issuesOpened += parseInt(rawData.issues[user]?.total_issues_opened || 0);
        acc.issuesClosed += parseInt(rawData.issues[user]?.total_issues_closed || 0);
        acc.prsOpened += rawData.pull_requests[user]?.total_prs_opened || 0;
        acc.commits += rawData.commits[user]?.total_commits || 0;
        return acc;
    }, { issuesOpened: 0, issuesClosed: 0, prsOpened: 0, commits: 0 });

    //Return averages for Org/Repo level to make the chart scale consistent
    return {
        "Avg Issues Opened": (totals.issuesOpened / count).toFixed(2),
        "Avg Issues Closed": (totals.issuesClosed / count).toFixed(2),
        "Avg PRs Opened": (totals.prsOpened / count).toFixed(2),
        "Avg Commits": (totals.commits / count).toFixed(2)
    };
};