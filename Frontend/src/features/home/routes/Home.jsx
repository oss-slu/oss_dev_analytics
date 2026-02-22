// Home page showing org-level averages

import VolumeCharts from "../../../components/charts/VolumeBased";
import { transformVolumeData } from "../../../utils/TransformVolumeData";
import TimeBased from "../../../components/charts/TimeBased";
import { transformTimeData } from "../../../utils/TransformTimeData";
import testData from "../../../../../Backend/test_data.json";
import TopContributorsRepos from "../../../components/TopContributorsRepos";
import "./Home.css"; // Import CSS for Home page styling

export const Home = () => {

  // Transforms raw test data into format suitable for VolumeCharts at org level
  const orgVolumeData = transformVolumeData(testData, 'org', null, "All");

  // Org-wide average time to close issues
  const orgAvgTimeToClose = transformTimeData({
    rawData: testData,
    repo: "oss_dev_analytics",
    category: "issues",
    metric: "average_time_to_close",
    scope: "org",
  });

  // Org-wide average time to merge pull requests
  const orgAvgTimeToMerge = transformTimeData({
    rawData: testData,
    repo: "oss_dev_analytics",
    category: "pull_requests",
    metric: "average_time_to_merge",
    scope: "org",
  });

  // Gather all repo events into a single array for the TopContributorsRepos component
  const orgEvents = Object.values(testData).flatMap(
    (repo) => repo.events || []
  );

  const orgTimeBasedData = [
    {
      label: "Avg Time to Close (Issues)",
      value: orgAvgTimeToClose?.[0]?.value ?? 0,
    },
    {
      label: "Avg Time to Merge (PRs)",
      value: orgAvgTimeToMerge?.[0]?.value ?? 0,
    },
  ];


  return (
    <div className="homePage">
      <h1 className="homeTitle">OSS Dev Analytics - Home</h1>
      <p className="homeSubtitle">Welcome to the dashboard.</p>

      {/* Top section: Volume chart + Top contributors/repos + placeholder (mockup layout) */}
      <div className="homeGrid">
        <div className="card cardBlue chartWrapper">
          <VolumeCharts data={orgVolumeData} repos="All" />
        </div>

        <div className="card cardTall contributorsCard">
          <TopContributorsRepos events={orgEvents} />
        </div>

        <div className="card cardTall placeholderCard">
          <div>
            TO BE <br />
            DETERMINED: <br />
            OTHER INTERNAL <br />
            DEVELOPER <br />
            GROUP INFO
          </div>
        </div>
      </div>

      {/* Bottom section: Handbook buttons + ONE combined time-based chart */}
      <div className="bottomGrid">
        <div className="handbookRow">
          <div className="handbookCard">
            <div className="handbookIcon">📄</div>
            <div className="handbookTitleText">DEVELOPER HANDBOOK</div>
          </div>

          <div className="handbookCard">
            <div className="handbookIcon">📄</div>
            <div className="handbookTitleText">TECH LEAD HANDBOOK</div>
          </div>
        </div>

        <div className="card cardBlue chartWrapper">
          <TimeBased data={orgTimeBasedData} repos="All" />
        </div>
      </div>
    </div>
  );
};