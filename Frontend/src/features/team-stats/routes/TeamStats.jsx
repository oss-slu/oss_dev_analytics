import { useState, useMemo } from "react";
import TimeBased from "../../components/charts/TimeBased";
import VolumeCharts from "../../../components/charts/VolumeBased";
import lifetime from "../../../lifetime_data.json";
import sprint from "../../../sprint_data.json";

import { getUniqueUsers, getUniqueTeams, buildTimeData, buildVolumeData } from "../../utils/teamStatsHelpers";
import TeamStatsSidebar from "./components/TeamStatsSidebar";
import StatSummaryGrid from "./components/StatSummaryGrid";

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
const TeamStats = () => {
  const [view, setView] = useState("team"); 
  const [selectedTeam, setSelectedTeam] = useState(TEAMS[0]);
  const [selectedSprint, setSelectedSprint] = useState(SPRINTS[0] || "1");
  const [selectedUser, setSelectedUser] = useState("all");

  const effectiveUser = view === "team" ? "all" : selectedUser;

  /* 
  Calculations that re-run only when the filtered user context changes 
  */
  const closeData = useMemo(() => buildTimeData(lifetime, "issues", "average_time_to_close", effectiveUser), [effectiveUser]);
  const mergeData = useMemo(() => buildTimeData(lifetime, "pull_requests", "average_time_to_merge", effectiveUser), [effectiveUser]);
  const volumeData = useMemo(() => buildVolumeData(lifetime, effectiveUser), [effectiveUser]);

  return (
    <div className="flex h-screen bg-[#f4f6fb] font-sans">
      <TeamStatsSidebar 
        view={view} setView={setView}
        selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam} TEAMS={TEAMS}
        selectedSprint={selectedSprint} setSelectedSprint={setSelectedSprint} SPRINTS={SPRINTS}
        selectedUser={selectedUser} setSelectedUser={setSelectedUser} USERS={USERS}
      />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[#123f8b]">
            {view === "team" ? `${selectedTeam} Overview` : `User: ${selectedUser}`}
          </h1>
          <p className="text-gray-600">Sprint {selectedSprint} Analytics</p>
        </header>

        <StatSummaryGrid closeData={closeData} mergeData={mergeData} volumeData={volumeData} />

        <h2 className="text-xl font-bold text-[#123f8b] mb-4 pb-2 border-b-2 border-[#123f8b] inline-block">
          Time-based Metrics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <TimeBased
              data={closeData}
              xKey="label"
              yKey="value"
              title="Avg Time to Close Issues (hrs)"
              repos={view === "team" ? "All" : selectedUser}
              user={view === "user" && selectedUser !== "all" ? selectedUser : null}
            />
            <p className="text-center text-sm text-gray-500 mt-2 font-semibold">Avg Time to Close Issues</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <TimeBased
              data={mergeData}
              xKey="label"
              yKey="value"
              title="Avg Time to Merge PRs (hrs)"
              repos={view === "team" ? "All" : selectedUser}
              user={view === "user" && selectedUser !== "all" ? selectedUser : null}
            />
            <p className="text-center text-sm text-gray-500 mt-2 font-semibold">Avg Time to Merge PRs</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-[#123f8b] mb-4 pb-2 border-b-2 border-[#123f8b] inline-block">
          Volume-based Metrics
        </h2>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="h-[350px] relative">
            <VolumeCharts
              data={volumeData}
              repos={view === "team" || selectedUser === "all" ? "All" : selectedUser}
              user={view === "user" && selectedUser !== "all" ? selectedUser : null}
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-2 font-semibold">Activity Volume</p>
        </div>
      </main>
    </div>
  );
};

export default TeamStats;