import { useState } from "react";
import VolumeCharts from "../../../components/charts/VolumeBased";
import { transformVolumeData } from "../../../utils/TransformVolumeData";
import TimeBased from "../../../components/charts/TimeBased";
import { calculateOrgAverage } from "../../../utils/TransformTimeData";
import { getTopContributorsAndRepos } from "../../../utils/getTopContributorsAndRepos";
import lifetimeData from "../../../../../data/lifetime_data.json";
import "./Home.css";
import { availableMetricsMock } from "../../../data/mockUserMetrics";
/*
    Main Home dashboard view displaying high-level organization metrics.
    Returns:
        JSX.Element: The Home dashboard component.
*/
export const Home = () => {
  /* 
    Transform lifetime data into volume chart format
  */
  const orgVolumeData = transformVolumeData(lifetimeData, 'org', null, "All");

  /*
    Calculate organization-level time-based metrics
  */
  const orgAvgClose = calculateOrgAverage(lifetimeData, "issues", "average_time_to_close");
  const orgAvgMerge = calculateOrgAverage(lifetimeData, "pull_requests", "average_time_to_merge");

  /*
    Assigned metrics are provided by tech leads
  */
  const assignedMetrics = [
    { label: "Avg Time to Close (Issues)", value: orgAvgClose },
    { label: "Avg Time to Merge (PRs)", value: orgAvgMerge },
  ];

  /*
    Custom metrics added by developer
    Starts empty and updates dynamically
  */
  const [customMetrics, setCustomMetrics] = useState([]);

  /*
    Convert mock metric names into displayable metric objects
  */
  const availableMetrics = availableMetricsMock.map(metric => {
    if (metric === "total_commits") {
      return { label: "Total Commits", value: orgVolumeData[0]?.value || 0 };
    }
    if (metric === "total_prs") {
      return { label: "Total PRs", value: orgVolumeData[1]?.value || 0 };
    }
    return null;
  }).filter(Boolean);

  /*
    Handles adding a new custom metric
  */
  const handleAddMetric = () => {
    const remainingMetrics = availableMetrics.filter(
      metric => !customMetrics.find(m => m.label === metric.label)
    );

    if (remainingMetrics.length === 0) return;

    const nextMetric = remainingMetrics[0];

    setCustomMetrics([...customMetrics, nextMetric]);
  };

  /*
    Get top contributors and repositories
  */
  const { topContributors, topRepos } = getTopContributorsAndRepos(lifetimeData, 12);

  return (
    <div className="home-container">
      
      <header className="home-header">
        <h1 className="home-title">OSS Analytics Dashboard</h1>
      </header>

      <div className="home-grid">
        <section className="card-blue">
          <h2 className="card-title">Organization Volume</h2>
          <div className="chart-wrapper">
            <VolumeCharts data={orgVolumeData} repos="All" />
          </div>
        </section>

        <section className="card-blue" style={{ height: "100%" }}>
          <h2 className="card-title">Top Contributors/Repos (Issues/PRs)</h2>
          <div className="contributors-wrapper" style={{ display: "flex", gap: "40px", marginTop: "8px" }}>
            
            {/* Top Contributors List */}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#123f8b", marginBottom: "12px", marginTop: 0 }}>
                Top Contributors
              </h3>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#374151" }}>
                {topContributors.length > 0 ? (
                  topContributors.map((user, index) => (
                    <li key={`user-${index}`} style={{ marginBottom: "4px" }}>
                      {user.name} ({user.count})
                    </li>
                  ))
                ) : (
                  <li style={{ color: "#4b5563" }}>No contributors found</li>
                )}
              </ul>
            </div>

            {/* Top Repositories List */}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#123f8b", marginBottom: "12px", marginTop: 0 }}>
                Top Repositories
              </h3>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#374151" }}>
                {topRepos.length > 0 ? (
                  topRepos.map((repo, index) => (
                    <li key={`repo-${index}`} style={{ marginBottom: "4px" }}>
                      {repo.name} ({repo.count})
                    </li>
                  ))
                ) : (
                  <li style={{ color: "#4b5563" }}>No repositories found</li>
                )}
              </ul>
            </div>

          </div>
        </section>
      </div>
      {/* Handbook / Links Section */}
      <div className="home-grid">
        <div className="handbook-column">

          <a href="https://docs.google.com/forms/d/e/1FAIpQLSdZF2zfa72ei0rg52cEIh0vpFiOKDmf27oF1DF2E3Oaf1Jhzg/viewform" target="_blank" rel="noreferrer" className="handbook-card">
            <div className="handbook-icon">📄</div>
            <div className="handbook-text">FEEDBACK FORM</div>
          </a>
      
          <a href="https://github.com/oss-slu/handbook_developer" target="_blank" rel="noreferrer" className="handbook-card">
            <div className="handbook-icon">📄</div>
            <div className="handbook-text">DEVELOPER HANDBOOK</div>
          </a>

          <a href="https://github.com/oss-slu/handbook_tech_lead" target="_blank" rel="noreferrer" className="handbook-card">
            <div className="handbook-icon">📄</div>
            <div className="handbook-text">TECH LEAD HANDBOOK</div>
          </a>
        </div>
      </div>

        {/* Assigned Metrics Section */}
        <section className="card-blue">
          <h2 className="card-title">Assigned Metrics</h2>

          <div className="chart-wrapper">
            <TimeBased data={assignedMetrics} repos="All" />
          </div>
        </section>

        {/* Custom Metrics Section */}
        <section className="card-blue">
          <h2 className="card-title">Custom Metrics</h2>

          {/* Add Metric Button */}
          <button
            onClick={handleAddMetric}
            style={{
              marginBottom: "10px",
              padding: "6px 12px",
              backgroundColor: "#123f8b",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            + Add Metric
          </button>

          <div className="chart-wrapper">
            {customMetrics.length > 0 ? (
              <TimeBased data={customMetrics} repos="All" />
            ) : (
              <p style={{ color: "#4b5563" }}>No custom metrics added</p>
            )}
          </div>
        </section>
    </div>  
  );
};
