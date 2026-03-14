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
  selectedUser, setSelectedUser, USERS
}) => {
  return (
    <aside className="w-64 bg-white p-5 border-r border-gray-200 flex flex-col gap-5 h-full">
      {/* View Toggle */}
      <div>
        <h3 className="block text-sm font-semibold text-gray-700 mb-2">View Mode</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="radio" checked={view === "team"} onChange={() => setView("team")} />
            Team View
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="radio" checked={view === "user"} onChange={() => setView("user")} />
            User View
          </label>
        </div>
      </div>

      {/* Team Filter */}
      {view === "team" && (
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Team</label>
          <select className="w-full p-2 border border-gray-300 rounded-md" value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
            {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      )}

      {/* User Filter */}
      {view === "user" && (
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">User</label>
          <select className="w-full p-2 border border-gray-300 rounded-md" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            {USERS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      )}

      {/* Sprint Filter */}
      <div className="flex flex-col gap-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Sprint</label>
        <select className="w-full p-2 border border-gray-300 rounded-md" value={selectedSprint} onChange={(e) => setSelectedSprint(e.target.value)}>
          {SPRINTS.map((s) => <option key={s} value={s}>Sprint {s}</option>)}
        </select>
      </div>
    </aside>
  );
};

export default TeamStatsSidebar;