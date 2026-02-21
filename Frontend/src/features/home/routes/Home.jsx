// Home page showing org-level averages

import VolumeCharts from "../../../components/charts/VolumeBased";
import { transformVolumeData } from "../../../utils/TransformVolumeData";
import TimeBased from "../../../components/charts/TimeBased";
import { transformTimeData } from "../../../utils/TransformTimeData";
import testData from "../../../../../Backend/test_data.json";
import TopContributorsRepos from "../../../components/TopContributorsRepos";

export const Home = () => {

  // Transforms raw test data into format suitable for VolumeCharts at org level
  const orgVolumeData = transformVolumeData(testData, 'org', null, "All");

  // Org-wide average time to close issues
  const orgAvgTimeToClose = transformTimeData({
    rawData: testData,
    repo: "oss_dev_analytics",
    category: "issues",
    metric: "average_time_to_close",
    scope: "org"
  });

  // Org-wide average time to merge pull requests
  const orgAvgTimeToMerge = transformTimeData({
    rawData: testData,
    repo: "oss_dev_analytics",
    category: "pull_requests",
    metric: "average_time_to_merge",
    scope: "org"
  });

  // Gather all repo events into a single array for the TopContributorsRepos component
  const orgEvents = Object.values(testData).flatMap(
    (repo) => repo.events || []
  );

  return (
    <div style={{ padding: "20px" }}> {/* Add spacing around the Home content */}
      <h1>OSS Dev Analytics - Home</h1>
      <p>Welcome to the dashboard.</p>

      {/* Display top contributors and their repos at the org level */}
      <TopContributorsRepos events={orgEvents} />
      
      {/* Display volume-based metrics at the org level */}
      <VolumeCharts data={orgVolumeData} repos="All"/>

      {/* Time-based metrics displayed together */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "30px",
        }}
      >
        <TimeBased
          data={orgAvgTimeToClose}
          title="Org Average Time to Close (Issues)"
        />

        <TimeBased
          data={orgAvgTimeToMerge}
          title="Org Average Time to Merge (PRs)"
        />
      </div>
    </div>
  );
};