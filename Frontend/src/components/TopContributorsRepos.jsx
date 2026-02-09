/*
    Component to display the top contributors and top repositories.

    This component is responsible only for rendering UI elements.
    All data aggregation and processing logic is delegated to a helper
    function to maintain separation of concenrs and improve reusability.

    Parms:
       events (Array<Object>): List of GitHub event objects passed from the parent component
*/

import { getTopContributorsAndRepos } from "../utils/getTopContributorsAndRepos";

const TOP_N = 5;

const TopContributorsRepos = ({ events = [] }) => {
  /*
      Retrieve pre-processes contributor and repository statistics
      The helper function handles counting, sorting, and limiting results
  */
  const { topContributors, topRepos } =
    getTopContributorsAndRepos(events, TOP_N);

  return (
    <div style={{ display: "flex", gap: "30px" }}>
      {/* Render list of top contributors by activity count */}
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