/*
    Sidebar component for filtering team and user statistics.
    Args:
        view (String): Current view state ('team' or 'user').
        setView (Function): Setter for view state.
        selectedTeam (String): Currently selected team.
        setSelectedTeam (Function): Setter for selected team.
        TEAMS (Array): List of available teams.
        selectedSprint (String): Currently selected sprint.
        setSelectedSprint (Function): Setter for selected sprint.
        SPRINTS (Array): List of available sprints.
        selectedUser (String): Currently selected user.
        setSelectedUser (Function): Setter for selected user.
        USERS (Array): List of available users.
    Returns:
        JSX.Element: The rendered sidebar element.
*/
const TeamStatsSidebar = ({
  view, setView,
  selectedTeam, setSelectedTeam, TEAMS,
  selectedSprint, setSelectedSprint, SPRINTS,
  selectedUserRepo, setSelectedUserRepo, 
  selectedUser, setSelectedUser, USERS 
}) => {
  return (
    <aside className="team-stats-sidebar">
      <div className="sidebar-section">
        <label className="sidebar-label">View Mode</label>
        <div className="sidebar-radio-group">
          <label className="radio-label">
            <input type="radio" checked={view === "team"} onChange={() => setView("team")} />
            Team View
          </label>
          <label className="radio-label">
            <input type="radio" checked={view === "user"} onChange={() => setView("user")} />
            User View
          </label>
        </div>
      </div>

      {view === "team" && (
        <div className="sidebar-section">
          <label className="sidebar-label">Team</label>
          <select className="sidebar-select" value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
            {TEAMS.map((t, index) => <option key={`team-${index}`} value={t}>{t}</option>)}
          </select>
        </div>
      )}

      {view === "user" && (
        <>
          <div className="sidebar-section">
            <label className="sidebar-label">Repository</label>
            <select 
              className="sidebar-select" 
              value={selectedUserRepo} 
              onChange={(e) => {
                setSelectedUserRepo(e.target.value);
                setSelectedUser("all");
              }}
            >
              {TEAMS.map((t, index) => <option key={`repo-${index}`} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="sidebar-section">
            <label className="sidebar-label">User</label>
            <select className="sidebar-select" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
              {USERS.map((u, index) => <option key={`user-${index}`} value={u}>{u}</option>)}
            </select>
          </div>
        </>
      )}

      <div className="sidebar-section">
        <label className="sidebar-label">Sprint</label>
        <select className="sidebar-select" value={selectedSprint} onChange={(e) => setSelectedSprint(e.target.value)}>
          {SPRINTS.map((s, index) => <option key={`sprint-${index}`} value={s}>Sprint {s}</option>)}
        </select>
      </div>
    </aside>
  );
};

export default TeamStatsSidebar;