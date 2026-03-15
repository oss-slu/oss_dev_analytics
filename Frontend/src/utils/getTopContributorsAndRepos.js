/*
    Helper function to compute the top contributors and top repositories
    based on aggregated lifetime data JSON.

    Params:
        lifetimeData (Object): The nested JSON object containing org-wide data.
        topN (number): Maximum number of contributors and repositories to return.
    
    Returns:
        Object: An object containing two arrays:
            - topContributors: Array of { name, count } objects
            - topRepos: Array of { name, count } objects
 */

export function getTopContributorsAndRepos(lifetimeData, topN) {
  const contributorStats = {};
  const repoStats = {};

  // Safely handle empty data
  if (!lifetimeData) return { topContributors: [], topRepos: [] };

  // Iterate through every repository in the organization
  Object.entries(lifetimeData).forEach(([repoName, repoData]) => {
    let repoTotalActivity = 0;

    // Helper to safely add metrics to a user's total and the repo's total
    const addActivity = (user, amount) => {
      const val = Number(amount) || 0;
      if (val > 0) {
        contributorStats[user] = (contributorStats[user] || 0) + val;
        repoTotalActivity += val;
      }
    };

    // Tally Issues (Opened + Closed)
    if (repoData.issues) {
      Object.entries(repoData.issues).forEach(([user, stats]) => {
        addActivity(user, stats.total_issues_opened);
        addActivity(user, stats.total_issues_closed);
      });
    }

    // Tally Pull Requests (Opened + Merged)
    if (repoData.pull_requests) {
      Object.entries(repoData.pull_requests).forEach(([user, stats]) => {
        addActivity(user, stats.total_prs_opened);
        addActivity(user, stats.total_prs_merged);
      });
    }

    // Tally Commits
    if (repoData.commits) {
      Object.entries(repoData.commits).forEach(([user, stats]) => {
        addActivity(user, stats.total_commits);
      });
    }

    // Add total repo activity to our tracker
    if (repoTotalActivity > 0) {
      repoStats[repoName] = (repoStats[repoName] || 0) + repoTotalActivity;
    }
  });

  // Sort contributors by activity volume (descending), then alphabetically
  const topContributors = Object.entries(contributorStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, topN);

  // Sort repositories by activity volume (descending), then alphabetically
  const topRepos = Object.entries(repoStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, topN);

  return { topContributors, topRepos };
}