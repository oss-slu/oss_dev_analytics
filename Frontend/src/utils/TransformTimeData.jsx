// Turns raw test_data.json into simple chart-ready data
// Keeps all data logic out of the chart component

export const transformTimeData = ({
  rawData,
  repo,
  category, // issues| pull_requests {want both issues and pull_requests, not or. May need to exclude or change value if the repos PR time is NaN}
  metric,
  scope = "org",
  user = null
}) => {

  const repoData = rawData?.[repo]?.[category];
  if (!repoData) return [];

  // Org-wide average (used on Home page)
  if (scope === "org") {
    const values = Object.values(repoData)
    .map(d => Number(d[metric]))
    .filter(v => !isNaN(v));

    if (!values.length) return [];

    return [{
      label: "Organization",
      value: values.reduce((a, b) => a + b, 0) / values.length
    }];
  }

  // also need a filter by repo. idea is repo -> display avg team metrics then users can pick a user - > which will then display the specific user metrics either for all time or specific sprint
  // Per-user data (used on Team Stats page) 
  if (scope === "user") {
    return Object.entries(repoData)
      .filter(([username]) => !user || username === user)
      .map(([username, data]) => ({
        label: username,
        value: Number(data[metric])
      }))
      .filter(d => !isNaN(d.value));
  }

  return [];
};