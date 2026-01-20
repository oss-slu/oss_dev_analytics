/**
 * Transforms raw JSON data into a format suitable for VolumeCharts.
 * Handles Organization, Repository, and User levels.
 * @param {Object} rawData - The JSON object from your project.
 * @param {string} filterType - 'org', 'repo', or 'user'. (Default is Org)
 * @param {string|null} selection - The specific user or repo name if filterType is not 'org'. (Default null)
 * @param {string} repo - The repository name for repo-level filtering (Default "All")
 * @returns {Object} A flat object with keys for Issues, PRs, and Commits.
 */
/**
 * Transforms raw JSON data into a format suitable for VolumeCharts.
 */
export const transformVolumeData = (rawData, filterType = 'org', selection = null, repo = "All") => {
    if (!rawData) return null;

    let combinedIssues = {};
    let combinedPRs = {};
    let combinedCommits = {};

    if (repo === "All") {
        //Aggregate all repos into one set of objects
        Object.values(rawData).forEach(r => {
            Object.assign(combinedIssues, r.issues || {});
            Object.assign(combinedPRs, r.pull_requests || {});
            Object.assign(combinedCommits, r.commits || {});
        });
    } else {
        const repoData = rawData[repo];
        if (!repoData) return null;
        combinedIssues = repoData.issues || {};
        combinedPRs = repoData.pull_requests || {};
        combinedCommits = repoData.commits || {};
    }

    //User-Level Logic
    if (filterType === 'user' && selection) {
        return {
            "Issues Opened": parseInt(combinedIssues[selection]?.total_issues_opened || 0),
            "Issues Closed": parseInt(combinedIssues[selection]?.total_issues_closed || 0),
            "PRs Opened": combinedPRs[selection]?.total_prs_opened || 0,
            "Commits": combinedCommits[selection]?.total_commits || 0
        };
    }

    //Repo/Org Logic (Averaging)
    const userKeys = Object.keys(combinedIssues);
    const count = userKeys.length || 1; //To prevent div by 0

    const totals = userKeys.reduce((acc, user) => {
        acc.issuesOpened += parseInt(combinedIssues[user]?.total_issues_opened || 0);
        acc.issuesClosed += parseInt(combinedIssues[user]?.total_issues_closed || 0);
        acc.prsOpened += combinedPRs[user]?.total_prs_opened || 0;
        acc.commits += combinedCommits[user]?.total_commits || 0;
        return acc;
    }, { issuesOpened: 0, issuesClosed: 0, prsOpened: 0, commits: 0 });

    return {
        "Avg Issues Opened": (totals.issuesOpened / count).toFixed(2),
        "Avg Issues Closed": (totals.issuesClosed / count).toFixed(2),
        "Avg PRs Opened": (totals.prsOpened / count).toFixed(2),
        "Avg Commits": (totals.commits / count).toFixed(2)
    };
};