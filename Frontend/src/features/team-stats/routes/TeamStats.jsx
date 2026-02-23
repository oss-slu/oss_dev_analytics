import { useState, useMemo } from "react";
import TimeBased from "../../../components/charts/TimeBased";
import VolumeCharts from "../../../components/charts/VolumeBased";
import testData from "../../../../../Frontend/test_data.json";

const USERS = ["all", ...Object.keys(testData.issues ?? {})];

//styling 
const C = {
  navy: "#123f8b",
  lightBg: "#cdd5e8",
  cardBg: "#dde3ef",
  bg: "#f4f6fb",
  muted: "#4b5563",
  white: "#ffffff",
};


/**
 * TimeBased-compatible array: [{ label, value }]
 * When user all is selected then it displays one bar per user 
 * When user all is selected then it displays one single bar for that user 
 */
function buildTimeData(category, metric, user) {
  const section = testData[category] ?? {};

  if (user === "all") {
    return Object.entries(section)
      .filter(([, v]) => v[metric] != null)
      .map(([username, v]) => ({
        label: username,
        value: parseFloat(v[metric].toFixed(2)),
      }));
  }

  const entry = section[user];
  if (!entry || entry[metric] == null) return [];
  return [{ label: user, value: parseFloat(entry[metric].toFixed(2)) }];
}

/**
 * VolumeCharts-compatible plain object: { "Label": number }
 * When the user is selected as all it sums across all users
 * When the user is selected as username it is only that user's values only
 */
function buildVolumeData(user) {
  const issues = testData.issues ?? {};
  const prs = testData.pull_requests ?? {};
  const commits = testData.commits ?? {};

  const sum = (section, key) =>
    Object.values(section).reduce((s, v) => s + (Number(v[key]) || 0), 0);

  const pick = (section, key, u) => Number(section[u]?.[key]) || 0;

  if (user === "all") {
    return {
      "Issues Opened": sum(issues, "total_issues_opened"),
      "Issues Closed": sum(issues, "total_issues_closed"),
      "PRs Opened": sum(prs, "total_prs_opened"),
      "PRs Merged": sum(prs, "total_prs_merged"),
      Commits: sum(commits, "total_commits"),
    };
  }

  return {
    "Issues Opened": pick(issues, "total_issues_opened", user),
    "Issues Closed": pick(issues, "total_issues_closed", user),
    "PRs Opened": pick(prs, "total_prs_opened", user),
    "PRs Merged": pick(prs, "total_prs_merged", user),
    Commits: pick(commits, "total_commits", user),
  };
}

// styling
const S = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    fontFamily: '"Times New Roman", Times, serif',
    padding: "0 20px 40px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "200px 1fr",
    gap: "32px",
    maxWidth: "1300px",
    margin: "32px auto 0",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  filterLabel: {
    display: "block",
    fontWeight: "700",
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: C.muted,
    marginBottom: "4px",
  },
  select: (disabled) => ({
    width: "100%",
    padding: "9px 32px 9px 12px",
    border: "none",
    borderRadius: "8px",
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: "0.95rem",
    cursor: disabled ? "not-allowed" : "pointer",

  }),
  sectionHeading: {
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: "1.25rem",
    fontWeight: "700",
    borderBottom: `2px solid ${C.lightBg}`,
    paddingBottom: "6px",
    marginBottom: "16px",
    marginTop: "32px",
  },
  toggleRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  toggleBtn: (active) => ({
    padding: "8px 20px",
    borderRadius: "8px",
    border: `2px solid ${C.navy}`,
    background: active ? C.navy : "transparent",
    color: active ? C.white : C.navy,
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
  }),
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "12px",
    marginBottom: "8px",
  },
  statCard: {
    background: C.navy,
    color: C.white,
    borderRadius: "10px",
    padding: "14px 10px",
    textAlign: "center",
  },
  statValue: { fontSize: "1.5rem", fontWeight: "700" },
  statLabel: { fontSize: "0.75rem", opacity: 0.85, marginTop: "4px" },
  chartRow: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
  },
  chartCard: {
    flex: "1 1 300px",
    background: C.lightBg,
    borderRadius: "12px",
    padding: "16px",
  },
  chartSubLabel: {
    textAlign: "center",
    fontWeight: "700",
    marginTop: "8px",
    fontSize: "0.9rem",
  },
  hint: {
    fontSize: "0.78rem",
    color: C.muted,
    marginTop: "4px",
  },
};
// team stats from user and team
export const TeamStats = () => {
  const [view, setView] = useState("team"); // "team" | "user"
  const [selectedUser, setSelectedUser] = useState("all");

  const activeUser = view === "team" ? "all" : selectedUser;

  // TimeBased data
  const closeData = useMemo(
    () => buildTimeData("issues", "average_time_to_close", activeUser),
    [activeUser]
  );
  const mergeData = useMemo(
    () => buildTimeData("pull_requests", "average_time_to_merge", activeUser),
    [activeUser]
  );

  // VolumeCharts data
  const volumeData = useMemo(() => buildVolumeData(activeUser), [activeUser]);

  // Summary numbers
  const avgOf = (arr) =>
    arr.length
      ? (arr.reduce((s, d) => s + d.value, 0) / arr.length).toFixed(1)
      : "–";

  const viewLabel =
    view === "team"
      ? "Whole Team"
      : selectedUser === "all"
      ? "All Users"
      : selectedUser;

  return (
    <div style={S.page}>

      <div style={S.layout}>
        {/*  Sidebar customization  */}
        <aside style={S.sidebar}>
          <div>
            <label style={S.filterLabel}>User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              style={S.select(view === "team")}
              disabled={view === "team"}
            >
              {USERS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            {view === "team" && (
              <p style={S.hint}>Switch to User View to filter by user.</p>
            )}
          </div>

          <div style={{ marginTop: "8px" }}>
            <p style={{ fontWeight: "700", marginBottom: "6px" }}>
              Sprint {testData.sprint}
            </p>
            <p
              style={{ fontSize: "0.85rem", color: C.muted, lineHeight: "1.5" }}
            >
              Data reflects the current sprint snapshot from test_data.json.
            </p>
          </div>
        </aside>

        {/*  Main heading  */}
        <main>
          <h1
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: "1.8rem",
              marginBottom: "16px",
            }}
          >
            Team Stats
          </h1>

          {/* toggle */}
          <div style={S.toggleRow}>
            <button
              style={S.toggleBtn(view === "team")}
              onClick={() => setView("team")}
            >
              Whole Team View
            </button>
            <button
              style={S.toggleBtn(view === "user")}
              onClick={() => {
                setView("user");
              }}
            >
              Specific User View
            </button>
          </div>

          <p
            style={{
              color: C.muted,
              marginBottom: "20px",
              fontSize: "0.95rem",
            }}
          >
            Showing: <strong style={{ color: C.navy }}>{viewLabel}</strong>
            {" · "}Sprint{" "}
            <strong style={{ color: C.navy }}>{testData.sprint}</strong>
          </p>

          {/* Summary of stats */}
          <div style={S.statGrid}>
            {[
              { label: "Avg Close Time (hrs)", value: avgOf(closeData) },
              { label: "Avg Merge Time (hrs)", value: avgOf(mergeData) },
              { label: "Issues Opened", value: volumeData["Issues Opened"] },
              { label: "PRs Opened", value: volumeData["PRs Opened"] },
              { label: "Total Commits", value: volumeData["Commits"] },
            ].map(({ label, value }) => (
              <div key={label} style={S.statCard}>
                <div style={S.statValue}>{value}</div>
                <div style={S.statLabel}>{label}</div>
              </div>
            ))}
          </div>

          {/*  Time-based charts  */}
          <h2 style={S.sectionHeading}>Time-based Metrics</h2>
          <div style={S.chartRow}>
            <div style={S.chartCard}>
              <TimeBased
                data={closeData}
                xKey="label"
                yKey="value"
                title="Avg Time to Close Issues (hrs)"
                repos={view === "team" ? "All" : selectedUser}
                user={
                  view === "user" && selectedUser !== "all"
                    ? selectedUser
                    : null
                }
              />
              <p style={S.chartSubLabel}>Avg Time to Close Issues</p>
            </div>
            <div style={S.chartCard}>
              <TimeBased
                data={mergeData}
                xKey="label"
                yKey="value"
                title="Avg Time to Merge PRs (hrs)"
                repos={view === "team" ? "All" : selectedUser}
                user={
                  view === "user" && selectedUser !== "all"
                    ? selectedUser
                    : null
                }
              />
              <p style={S.chartSubLabel}>Avg Time to Merge PRs</p>
            </div>
          </div>

          {/*  Volume-based charts  */}
          <h2 style={S.sectionHeading}>Volume-based Metrics</h2>
          <div style={S.chartRow}>
            <div style={S.chartCard}>
              <VolumeCharts
                data={volumeData}
                repos={view === "team" ? "All" : selectedUser}
                user={
                  view === "user" && selectedUser !== "all"
                    ? selectedUser
                    : null
                }
              />
              <p style={S.chartSubLabel}>Activity Volume</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamStats;
