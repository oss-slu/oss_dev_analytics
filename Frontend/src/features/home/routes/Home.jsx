import VolumeCharts from "../../../components/charts/VolumeBased";
import { transformVolumeData } from "../../../utils/TransformVolumeData";
import TimeBased from "../../../components/charts/TimeBased";
import { calculateOrgAverage } from "../../../utils/TransformTimeData";
import { getTopContributorsAndRepos } from "../../../utils/getTopContributorsAndRepos";
import lifetimeData from "../../../../../data/lifetime_data.json";
import "./Home.css";
/*
    Main Home dashboard view displaying high-level organization metrics.
    Returns:
        JSX.Element: The Home dashboard component.
*/
export const Home = () => {
  const orgVolumeData = transformVolumeData(lifetimeData, 'org', null, "All");

  const orgAvgClose = calculateOrgAverage(lifetimeData, "issues", "average_time_to_close");
  const orgAvgMerge = calculateOrgAverage(lifetimeData, "pull_requests", "average_time_to_merge");

  const orgTimeBasedData = [
    { label: "Avg Time to Close (Issues)", value: orgAvgClose },
    { label: "Avg Time to Merge (PRs)", value: orgAvgMerge },
  ];

  // 2. Call your utility function right here to get the top 5
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
          <h2 className="card-title">Leaderboard Streaks</h2>
          <div className="contributors-wrapper" style={{ display: "flex", gap: "40px", marginTop: "8px" }}>
            
            {/* Top Contributors List */}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#123f8b", marginBottom: "12px", marginTop: 0 }}>
                Top Contributors{" "}
                <span
                  tabIndex="0"
                  aria-label="Leaderboard streak info"
                  title="A streak increases for every consecutive 7-day period where a user closes at least 3 issues. Streak resets if threshold is not met."
                  style={{
                    cursor: "pointer",
                    border: "1px solid black",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "12px"
                  }}
                >
                  i
                </span>
              </h3>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#374151" }}>
                {topContributors.length > 0 ? (
                  topContributors.map((user, index) => (
                    <li key={`user-${index}`} style={{ marginBottom: "4px" }}>
                      {user.name} 🔥 {user.currentStreak} {user.currentStreak === 1 ? "week" : "weeks"} streak ({user.count})
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
                      {repo.name} 🔥 {repo.streak} {repo.streak === 1 ? "week" : "weeks"} streak ({repo.activeMembers} {repo.activeMembers === 1 ? "member" : "members"})
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
      <div className="home-grid">
        <div className="handbook-column">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSdZF2zfa72ei0rg52cEIh0vpFiOKDmf27oF1DF2E3Oaf1Jhzg/viewform" target="_blank" rel="noreferrer" className="handbook-card">
            <div className="handbook-icon">📄</div>
            <div className="handbook-text">FEEDBACK FORM</div>
          </a>
      <div className="home-grid">
        <div className="handbook-column">
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
