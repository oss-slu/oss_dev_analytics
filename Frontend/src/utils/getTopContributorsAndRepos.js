/*
    Helper function to compute the top contributors and top repositories
    based on GitHub event activity

    This function contains all data-processing logic and is intentionally
    kept separate from the React componenet to improve readability,
    reusability, and testability

    Params:
        events (Array<Object>): List of GitHub event objects containing
            contributor and repository information
        topN (number): Maximum number of contributors and repositories
            to return
    
    Returns:
        Object: An object containing two arrays:
            - topContributors: Array of { name, count } objects
            - topRepos: Array of { name, count } objects
 */

export function getTopContributorsAndRepos(events, topN) {
  const contributorStats = {};
  const repoStats = {};

  // Iterate through each event once and update both contributor and repo counts
  events.forEach((event) => {
    // Track contributor activity count
    if (event.author) {
      contributorStats[event.author] =
        (contributorStats[event.author] || 0) + 1;
    }

    // Track repository activity count
    if (event.repo) {
      repoStats[event.repo] =
        (repoStats[event.repo] || 0) + 1;
    }
  });

  // Sort contributors by activity volume (descending),
  // then alphabetically to ensure stable ordering
  const topContributors = Object.entries(contributorStats)
    .map(([name, count]) => ({ name, count }))
    .sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name)
    )
    .slice(0, topN);

  // Sort repositories by activity volume (descending),
  // then alphabetically to ensure stable ordering
  const topRepos = Object.entries(repoStats)
    .map(([name, count]) => ({ name, count }))
    .sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, topN);

  return { topContributors, topRepos };
}