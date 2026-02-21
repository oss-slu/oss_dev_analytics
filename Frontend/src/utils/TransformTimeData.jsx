// Turns raw test_data.json into simple chart-ready data
// Keeps all data logic out of the chart component

export const transformTimeData = ({
  rawData,
  repo,
  categories = ["issues", "pull_requests"],
  metric,
  scope = "org",
  user = null
}) => {

  if (!rawData?.[repo]) return [];

  // Collect valid metric values across categories
  const collectValues = (username = null) => {
    const values = [];

    categories.forEach(category => {
      const categoryData = rawData[repo][category];
      if (!categoryData) return;

      // Org-level: all users
      if (!username) {
        Object.values(categoryData).forEach(d => {
          const v = Number(d[metric]);
          if (!isNaN(v)) values.push(v);
        });
      }
      // User-level
      else {
        const v = Number(categoryData?.[username]?.[metric]);
        if (!isNaN(v)) values.push(v);
      }
    });

    return values;
  };

  // ─────────────────────────────
  // Org-wide average
  // ─────────────────────────────
  if (scope === "org") {
    const values = collectValues();
    if (!values.length) return [];

    return [{
      label: "Organization",
      value: values.reduce((a, b) => a + b, 0) / values.length
    }];
  }

  // ─────────────────────────────
  // Per-user metrics
  // ─────────────────────────────
  if (scope === "user") {
    const users = new Set();

    categories.forEach(category => {
      Object.keys(rawData[repo][category] || {}).forEach(u =>
        users.add(u)
      );
    });

    return Array.from(users)
      .filter(u => !user || u === user)
      .map(username => {
        const values = collectValues(username);
        if (!values.length) return null;

        return {
          label: username,
          value: values.reduce((a, b) => a + b, 0) / values.length
        };
      })
      .filter(Boolean);
  }

  return [];
};