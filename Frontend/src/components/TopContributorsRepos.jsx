// Component to show top contributors and top repositories
// Based on volume of activity (commits, issues, etc.)

import testData from "../test_data.json";

const TOP_N = 5;

const TopContributorsRepos = () => {
  // Each event represents some kind of activity
  const events = testData.events || [];

  // Calculate contributor volume
  const contributorStats = {};

  events.forEach((event) => {
    if (!event.author) return;

    contributorStats[event.author] =
      (contributorStats[event.author] || 0) + 1;
  });

  const topContributors = Object.entries(contributorStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_N);

  // Calculate repository volume
  const repoStats = {};

  events.forEach((event) => {
    if (!event.repo) return;

    repoStats[event.repo] =
      (repoStats[event.repo] || 0) + 1;
  });

  const topRepos = Object.entries(repoStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_N);

  return (
    <div style={{ display: "flex", gap: "30px" }}>
      {/* Top Contributors */}
      <div>
        <h3>Top Contributors</h3>
        <ul>
          {topContributors.map((user, index) => (
            <li key={index}>
              {user.name} ({user.count})
            </li>
          ))}
        </ul>
      </div>

      {/* Top Repositories */}
      <div>
        <h3>Top Repositories</h3>
        <ul>
          {topRepos.map((repo, index) => (
            <li key={index}>
              {repo.name} ({repo.count})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopContributorsRepos;