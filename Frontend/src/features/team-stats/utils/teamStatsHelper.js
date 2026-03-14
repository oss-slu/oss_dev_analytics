/*
    Collect unique users across all repositories in the lifetime data.
    Args:
        lifetimeData (Object): The parsed JSON object of repository data.
    Returns:
        Array: List of unique usernames, with "all" as the first element.
*/
export const getUniqueUsers = (lifetimeData) => {
  return [
    "all",
    ...Array.from(
      new Set(
        Object.values(lifetimeData).flatMap((repo) => [
          ...Object.keys(repo.issues ?? {}),
          ...Object.keys(repo.pull_requests ?? {}),
          ...Object.keys(repo.commits ?? {})
        ])
      )
    )
  ];
};
/*
    Extract unique team (repository) names from the lifetime data.
    Args:
        lifetimeData (Object): The parsed JSON object of repository data.
    Returns:
        Array: List of team names, with "All Teams" as the first element.
*/
export const getUniqueTeams = (lifetimeData) => {
  return ["All Teams", ...Object.keys(lifetimeData)];
};

/*
    Calculate time-based metrics (e.g., average time to close or merge) for a specific user or all users.
    Args:
        lifetimeData (Object): The parsed JSON object of repository data.
        category (String): The category to parse ('issues' or 'pull_requests').
        metric (String): The specific metric key to retrieve.
        user (String): The selected username, or "all".
    Returns:
        Array: A list of objects formatted as { label: username, value: average_metric }.
*/
export const buildTimeData = (lifetimeData, category, metric, user) => {
  const userValues = {};

  Object.values(lifetimeData).forEach((repo) => {
    const section = repo[category] ?? {};

    if (user === "all") {
      Object.entries(section).forEach(([username, metrics]) => {
        if (metrics[metric] != null) {
          if (!userValues[username]) userValues[username] = [];
          userValues[username].push(metrics[metric]);
        }
      });
    } else {
      if (section[user] && section[user][metric] != null) {
        if (!userValues[user]) userValues[user] = [];
        userValues[user].push(section[user][metric]);
      }
    }
  });

  return Object.entries(userValues).map(([username, values]) => ({
    label: username,
    value: parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)),
  }));
};

/*
    Aggregate volume metrics (opened, closed, merged, commits) for a specific user.
    Args:
        lifetimeData (Object): The parsed JSON object of repository data.
        user (String): The selected username, or "all".
    Returns:
        Object: Key-value pairs of aggregated volume metrics.
*/
export const buildVolumeData = (lifetimeData, user) => {
  let issuesOpened = 0, issuesClosed = 0, prsOpened = 0, prsMerged = 0, commits = 0;

  Object.values(lifetimeData).forEach((repo) => {
    const issues = repo.issues ?? {};
    const prs = repo.pull_requests ?? {};
    const repoCommits = repo.commits ?? {};

    const addMetrics = (u) => {
      issuesOpened += Number(issues[u]?.total_issues_opened) || 0;
      issuesClosed += Number(issues[u]?.total_issues_closed) || 0;
      prsOpened += Number(prs[u]?.total_prs_opened) || 0;
      prsMerged += Number(prs[u]?.total_prs_merged) || 0;
      commits += Number(repoCommits[u]?.total_commits) || 0;
    };

    if (user === "all") {
      const allRepoUsers = new Set([
        ...Object.keys(issues),
        ...Object.keys(prs),
        ...Object.keys(repoCommits),
      ]);
      allRepoUsers.forEach(addMetrics);
    } else {
      addMetrics(user);
    }
  });

  return {
    "Issues Opened": issuesOpened,
    "Issues Closed": issuesClosed,
    "PRs Opened": prsOpened,
    "PRs Merged": prsMerged,
    Commits: commits,
  };
}