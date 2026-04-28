import TimeBased from "../../../components/charts/TimeBased";
import VolumeCharts from "../../../components/charts/VolumeBased";
import PRMergeSuccessRateChart from "../../../components/charts/PRMergeSuccessRateChart";
import lifetime from "../../../../../data/lifetime_data.json";
import sprint from "../../../../../data/sprint_data.json";
import { calculateHealthScore } from "../utils/calculateHealth.js";
import UserSetup from "../components/UserSetup.jsx";


import { getUniqueUsers, getUniqueTeams, getUsersByRepo, buildTimeData, buildVolumeData } from "../utils/teamStatsHelper.js";
import TeamStatsSidebar from "../components/teamStatsSidebar";
import StatSummaryGrid from "../components/statSummaryGrid";
import "./TeamStats.css";
import ActionableInsightsPanel from "../../../components/ActionableInsightsPanel.jsx";
import { getActionableInsights } from "../../../utils/getActionableInsights.js";
import MetricsPanel from "../../../components/MetricsPanel.jsx";

import { useState, useMemo, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";
import { fetchAvailableRepos, fetchOrCreateUserDocument } from "../utils/teamStatsAccounts.js";
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

  const [authUser, setAuthUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loadingUserDoc, setLoadingUserDoc] = useState(true);
  const [availableRepos, setAvailableRepos] = useState([]);

  // Listen for repo request from setup and fetch available repos for user
  useEffect(() => {
    const loadRepos = async () => {
      const fetchedRepos = await fetchAvailableRepos();
      setAvailableRepos(fetchedRepos);
    };
    
    loadRepos();
  }, []);
  
  // Listen for Firebase auth state changes to manage user session and data fetching
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user) {
        const data = await fetchOrCreateUserDocument(user);
        setUserDoc(data);
    
      if (data && data.trackedRepos && data.trackedRepos.length > 0) {
        setSelectedUserRepo(data.trackedRepos[0]);
        setSelectedTeam(data.trackedRepos[0]);
      }
    }
     setLoadingUserDoc(false);
  });

    return () => unsubscribe(); // stop listener
  }, []);

  const availableUsers = useMemo(() => getUsersByRepo(lifetime, selectedUserRepo), [selectedUserRepo]);
  const effectiveUser = view === "team" ? "all" : selectedUser;

  const effectiveData = useMemo(() => {
    const repoFilter = view === "team" ? selectedTeam : selectedUserRepo;
    if (repoFilter === "All Teams") return lifetime;
    return { [repoFilter]: lifetime[repoFilter] || {} };
  }, [view, selectedTeam, selectedUserRepo]);

  const healthScoreData = useMemo(() => {
    const activeMetrics = userDoc ?.trackedMetrics?.length > 0
      ? userDoc.trackedMetrics
      : [];
    return calculateHealthScore(effectiveData, activeMetrics);
  }, [effectiveData, userDoc]);

  const insights = getActionableInsights(healthScoreData);
  const isHealthy = insights.length === 0;

  const closeData = useMemo(() => buildTimeData(effectiveData, "issues", "average_time_to_close", effectiveUser), [effectiveData, effectiveUser]);
  const mergeData = useMemo(() => buildTimeData(effectiveData, "pull_requests", "average_time_to_merge", effectiveUser), [effectiveData, effectiveUser]);
  const volumeData = useMemo(() => buildVolumeData(effectiveData, effectiveUser), [effectiveData, effectiveUser]);

    
  if (loadingUserDoc) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl text-gray-600 font-bold">
        Loading...
      </div>
    );
  }
  const needsSetup = authUser && (!userDoc || !userDoc.trackedRepos || userDoc.trackedRepos.length === 0); 
  
  if (needsSetup) {
    return (
      <UserSetup 
        userId={authUser.uid} 
        userDoc={userDoc}
        availableRepos={availableRepos}
        onComplete={(selectedPreferences) => {
          setUserDoc({
            ...userDoc, 
            trackedRepos: selectedPreferences.trackedRepos,
            trackedMetrics: selectedPreferences.trackedMetrics 
          });
          setSelectedTeam(selectedPreferences.trackedRepos[0]);
          setSelectedUserRepo(selectedPreferences.trackedRepos[0]);
        }}
      />
    );
  }
    
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

        <ActionableInsightsPanel insights={insights} isHealthy={isHealthy} />
        
        <MetricsPanel selectedMetrics={healthScoreData.selected_metrics || []} /> 
        
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
        <h2 className="section-heading">PR Metrics</h2>
        <div className="chart-card">
          <PRMergeSuccessRateChart 
            selectedTeam={view === "team" ? selectedTeam : selectedUserRepo}
          />
          <p className="chart-sublabel">
            PR Merge Success Rate (Lifetime vs Sprint)
            </p>
        </div>
      </main>
    </div>
  );
};