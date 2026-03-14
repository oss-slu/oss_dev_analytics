/*
    Component to display the top contributors and top repositories.

    This component is responsible only for rendering UI elements.
    All data aggregation and processing logic is delegated to a helper
    function to maintain separation of concenrs and improve reusability.

    Parms:
       events (Array<Object>): List of GitHub event objects passed from the parent component
*/

import { getTopContributorsAndRepos } from "../utils/getTopContributorsAndRepos";
import testData from "../test_data.json";


const TOP_N = 5;

const TopContributorsRepos = ({ events }) => {

  // Converting repo JSON structure into event-like objects
  const eventData = [];

  Object.entries(testData)
  .filter(([repoName]) => !repoName.includes("sprint"))
  .forEach(([repoName, repo]) => {

  const issues = repo?.issues || {};
  const prs = repo?.pull_requests || {};
  const commits = repo?.commits || {};

  Object.entries(issues).forEach(([user, stats]) => {
    const count = Number(stats.total_issues_opened) || 0;
    for (let i = 0; i < count; i++) {
      eventData.push({ author: user, repo: repoName });
    }
  });

  Object.entries(prs).forEach(([user, stats]) => {
    const count = Number(stats.total_prs_opened) || 0;
    for (let i = 0; i < count; i++) {
      eventData.push({ author: user, repo: repoName });
    }
  });

  Object.entries(commits).forEach(([user, stats]) => {
    const count = Number(stats.total_commits) || 0;
    for (let i = 0; i < count; i++) {
      eventData.push({ author: user, repo: repoName });
    }
  });

});

  console.log("eventData length:", eventData.length);
  console.log(eventData.slice(0,5));  

  const { topContributors, topRepos } =
    getTopContributorsAndRepos(eventData, TOP_N);

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