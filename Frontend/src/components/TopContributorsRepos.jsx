/*
    Component to display the top contributors and top repositories.

    This component is responsible only for rendering UI elements.
    All data aggregation and processing logic is delegated to a helper
    function to maintain separation of concenrs and improve reusability.

    Parms:
       events (Array<Object>): List of GitHub event objects passed from the parent component
*/

import { getTopContributorsAndRepos } from "../utils/getTopContributorsAndRepos";
import lifetimeData from "../../../lifetimeData.json";


const TOP_N = 5;

const TopContributorsRepos = () => {
  // Converting repo JSON structure into event-like objects
  const selectedRepo = "core_desk";
  const {topContributors, topRepos} = getTopContributorsAndRepos(lifetimeData, TOP_N, selectedRepo);

  return (
    <div style={{ display: "flex", gap: "30px" }}>
      {/* Render list of top contributors by activity count */}
      <div>
        <h3>
          Top Contributors{" "}
          <span
            tabIndex="0"
            aria-label="Leaderboard streak info"
            title="A streak increases for every consecutive 7-day period where a user closes at least 3 issues. Streak resets if threshold is not met."
            style={{ cursor: "pointer", border: "1px solid black", borderRadius: "50%", padding: "2px 6px", fontSize: "12px" }}
          >
            i
          </span>
        </h3>
        <ul>
          {topContributors.map((user) => (
            <li key={user.name}>
              {user.name} 🔥 {user.currentStreak} {user.currentStreak === 1 ? "week" : "weeks"} streak ({user.count})
            </li>
          ))}
        </ul>
      </div>

      {/* Render list of top repositories by activity count */}
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