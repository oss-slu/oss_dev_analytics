import VolumeCharts from "../../../components/charts/VolumeBased";
import { transformVolumeData } from "../../../utils/TransformVolumeData";
import TimeBased from "../../../components/charts/TimeBased";
import { transformTimeData } from "../../../utils/TransformTimeData";
import TopContributorsRepos from "../../../components/TopContributorsRepos";
import lifetimeData from "../../../../../data/lifetime_data.json";
import "./Home.css";
/*
    Main Home dashboard view displaying high-level organization metrics.
    Returns:
        JSX.Element: The Home dashboard component.
*/
export const Home = () => {
  const orgVolumeData = transformVolumeData(lifetimeData, 'org', null, "All");

  const orgAvgTimeToClose = transformTimeData({
    rawData: lifetimeData, 
    repo: "All", 
    category: "issues",
    metric: "average_time_to_close",
    scope: "org",
  });

  const orgAvgTimeToMerge = transformTimeData({
    rawData: lifetimeData, 
    repo: "All", 
    category: "pull_requests",
    metric: "average_time_to_merge",
    scope: "org",
  });

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
    <div className="home-container">
      
      <header className="home-header">
        <h1 className="home-title">OSS Analytics Dashboard</h1>
      </header>

      {/* Top section: Volume chart + Top contributors/repos */}
      <div className="home-grid">
        <section className="card-blue">
          <h2 className="card-title">Organization Volume</h2>
          <div className="chart-wrapper">
            <VolumeCharts data={orgVolumeData} repos="All" />
          </div>
        </section>

        <section className="card-blue" style={{ height: "100%" }}>
          <h2 className="card-title">Top Contributors</h2>
          <div className="contributors-wrapper">
            <TopContributorsRepos data={orgVolumeData} />
          </div>
        </section>
      </div>

      {/* Bottom section: Handbook buttons + Time-based chart */}
      <div className="home-grid">
        <div className="handbook-column">
          <a
            href="https://github.com/oss-slu/handbook_developer"
            target="_blank"
            rel="noreferrer"
            className="handbook-card"
          >
            <div className="handbook-icon">📄</div>
            <div className="handbook-text">DEVELOPER HANDBOOK</div>
          </a>

          <a
            href="https://github.com/oss-slu/handbook_tech_lead"
            target="_blank"
            rel="noreferrer"
            className="handbook-card"
          >
            <div className="handbook-icon">📄</div>
            <div className="handbook-text">TECH LEAD HANDBOOK</div>
          </a>
        </div>

        <section className="card-blue">
          <h2 className="card-title">Time-based Metrics</h2>
          <div className="chart-wrapper">
            <TimeBased data={orgTimeBasedData} repos="All" />
          </div>
        </section>
      </div>

    </div>
  );
};