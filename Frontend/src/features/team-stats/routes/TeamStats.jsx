import { useState, useMemo } from "react";
import TimeBased from "../../../components/charts/TimeBased";
import VolumeCharts from "../../../components/charts/VolumeBased";
import lifetime from "../../../../../data/lifetime_data.json";
import sprint from "../../../../../data/sprint_data.json";
import CollaborationChart from "../../../components/charts/CollaborationChart.jsx";

import { getUniqueUsers, getUniqueTeams, getUsersByRepo, buildTimeData, buildVolumeData } from "../utils/teamStatsHelper.js";
import TeamStatsSidebar from "../components/teamStatsSidebar";
import StatSummaryGrid from "../components/statSummaryGrid";
import "./TeamStats.css";

/* 
Constants initialized outside the component to prevent re-creation on render 
*/
const USERS = getUniqueUsers(lifetime);
const TEAMS = getUniqueTeams(lifetime);
const SPRINTS = [sprint.sprint]; 

/*
    Main dashboard view for Team and User statistics.
    Returns:
        JSX.Element: The assembled TeamStats dashboard.
*/
export const TeamStats = () => {
  const [view, setView] = useState("team"); 
  const [selectedTeam, setSelectedTeam] = useState(TEAMS[0]);
  const [selectedUserRepo, setSelectedUserRepo] = useState(TEAMS[0]);
  const [selectedSprint, setSelectedSprint] = useState(SPRINTS[0] || "1");
  const [selectedUser, setSelectedUser] = useState("all");

  const availableUsers = useMemo(() => getUsersByRepo(lifetime, selectedUserRepo), [selectedUserRepo]);
  const effectiveUser = view === "team" ? "all" : selectedUser;

  const effectiveData = useMemo(() => {
    const repoFilter = view === "team" ? selectedTeam : selectedUserRepo;
    if (repoFilter === "All Teams") return lifetime;
    return { [repoFilter]: lifetime[repoFilter] || {} };
  }, [view, selectedTeam, selectedUserRepo]);

  const closeData = useMemo(() => buildTimeData(effectiveData, "issues", "average_time_to_close", effectiveUser), [effectiveData, effectiveUser]);
  const mergeData = useMemo(() => buildTimeData(effectiveData, "pull_requests", "average_time_to_merge", effectiveUser), [effectiveData, effectiveUser]);
  const volumeData = useMemo(() => buildVolumeData(effectiveData, effectiveUser), [effectiveData, effectiveUser]);

    const selectedRepo = view === "team" ? selectedTeam : selectedUserRepo;

  const teamRadarData = useMemo(() => {
    if (!selectedRepo || selectedRepo === "All Teams" || !lifetime[selectedRepo]) return [];

    const repoData = lifetime[selectedRepo];

    const totalIssuesClosed = Object.values(repoData.issues || {}).reduce(
      (sum, user) => sum + Number(user.total_issues_closed || 0),
      0
    );

    const totalPrsOpened = Object.values(repoData.pull_requests || {}).reduce(
      (sum, user) => sum + Number(user.total_prs_opened || user.total_prcs_opened || 0),
      0
    );

    const totalPrsMerged = Object.values(repoData.pull_requests || {}).reduce(
      (sum, user) => sum + Number(user.total_prs_merged || 0),
      0
    );

    return [
      { metric: "PR Reviews", value: totalPrsMerged },
      { metric: "Issue Comments", value: totalIssuesClosed },
      { metric: "PR Comments", value: totalPrsOpened },
    ];
  }, [selectedRepo]);

  return (
    <div className="team-stats-container">
      <TeamStatsSidebar 
        view={view} setView={setView}
        selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam} TEAMS={TEAMS}
        selectedSprint={selectedSprint} setSelectedSprint={setSelectedSprint} SPRINTS={SPRINTS}
        selectedUserRepo={selectedUserRepo} setSelectedUserRepo={setSelectedUserRepo} 
        selectedUser={selectedUser} setSelectedUser={setSelectedUser} USERS={availableUsers}
      />

      <main className="team-stats-main">
        <header>
          <h1 className="header-title">
            {view === "team" ? `${selectedTeam} Overview` : `User: ${selectedUser}`}
          </h1>
          <p className="header-subtitle">Lifetime Data</p>
        </header>

        <StatSummaryGrid closeData={closeData} mergeData={mergeData} volumeData={volumeData} />

        <h2 className="section-heading">Time-based Metrics</h2>
        <div className="charts-grid">
          <div className="chart-card">
            <TimeBased
              data={closeData}
              xKey="label"
              yKey="value"
              title="Avg Time to Close Issues (hrs)"
              repos={view === "team" ? selectedTeam : selectedUserRepo}
              user={view === "user" && selectedUser !== "all" ? selectedUser : null}
            />
            <p className="chart-sublabel">Avg Time to Close Issues</p>
          </div>
          <div className="chart-card">
            <TimeBased
              data={mergeData}
              xKey="label"
              yKey="value"
              title="Avg Time to Merge PRs (hrs)"
              repos={view === "team" ? selectedTeam : selectedUserRepo}
              user={view === "user" && selectedUser !== "all" ? selectedUser : null}
            />
            <p className="chart-sublabel">Avg Time to Merge PRs</p>
          </div>
        </div>

        <h2 className="section-heading">Volume-based Metrics</h2>
        <div className="chart-card">
          <div style={{ height: "350px", position: "relative" }}>
            <VolumeCharts
              data={volumeData}
              repos={view === "team" || selectedUser === "all" ? "All" : selectedUser}
              user={view === "user" && selectedUser !== "all" ? selectedUser : null}
            />
          </div>
          <p className="chart-sublabel">Activity Volume</p>
        </div>

                {selectedRepo !== "All Teams" && teamRadarData.length > 0 && (
          <>
            <h2 className="section-heading">Collaboration Index</h2>
            <div className="chart-card" style={{ display: "flex", justifyContent: "center" }}>
              <CollaborationChart
                data={teamRadarData}
                mode="team"
                title={`${selectedRepo} Collaboration Radar`}
              />
              <p className="chart-sublabel">Repository Collaboration Profile</p>
            </div>
          </>
        )}

      </main>
    </div>
  );
};