// Component to show top contributors and top repositories
// Focuses mainly on rendering, while data logic lives in a helper

import { getTopContributorsAndRepos } from "../utils/getTopContributorsAndRepos";

const TOP_N = 5;

const TopContributorsRepos = ({ events = [] }) => {
  // Get pre-processed data from helper function
  const { topContributors, topRepos } =
    getTopContributorsAndRepos(events, TOP_N);

  return (
    <div style={{ display: "flex", gap: "30px" }}>
      {/* Top Contributors */}
      <div>
        <h3>Top Contributors</h3>
        <ul>
          {topContributors.map((user) => (
            <li key={user.name}>
              {user.name} ({user.count})
            </li>
          ))}
        </ul>
      </div>

      {/* Top Repositories */}
      <div>
        <h3>Top Repositories</h3>
        <ul>
          {topRepos.map((repo) => (
            <li key={repo.name}>
              {repo.name} ({repo.count})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopContributorsRepos;