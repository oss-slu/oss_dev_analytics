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

  return (
    <div style={{ padding: "20px" }}>
      <h1>OSS Dev Analytics - Home</h1>
      <p>Welcome to the dashboard.</p>

      <TimeBased
        data={orgAvgTimeToClose}
        title="Org Average Time to Close (Issues)"
      />
    </div>
  );
};