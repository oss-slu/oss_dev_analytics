// Home page showing org-level averages

import TimeBased from "../../../components/charts/TimeBased";
import { transformTimeData } from "../../../utils/TransformTimeData";
import testData from "../../../../../Backend/test_data.json";

export const Home = () => {

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

  return (
    <div style={{ padding: "20px" }}>
      <h1>OSS Dev Analytics - Home</h1>
      <p>Welcome to the dashboard.</p>

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