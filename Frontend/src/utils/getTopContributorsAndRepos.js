// Helper function to calculate top contributors and repositories
// Keeps data-processing logic separate from the React component
// This makes the component cleaner and easier to test later

export function getTopContributorsAndRepos(events, topN) {
  const contributorStats = {};
  const repoStats = {};

  // Go through each event once and update both counters
  events.forEach((event) => {
    // Count contributor activity
    if (event.author) {
      contributorStats[event.author] =
        (contributorStats[event.author] || 0) + 1;
    }

    // Count repository activity
    if (event.repo) {
      repoStats[event.repo] =
        (repoStats[event.repo] || 0) + 1;
    }
  });

  // Sort contributors by activity count and take top N
  const topContributors = Object.entries(contributorStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);

  // Sort repositories by activity count and take top N
  const topRepos = Object.entries(repoStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);

  return { topContributors, topRepos };
}