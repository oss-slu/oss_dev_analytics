/*
    Collect unique users across all repositories in the lifetime data.
    Args:
        lifetimeData (Object): The parsed JSON object of repository data.
    Returns:
        Array: List of unique usernames, with "all" as the first element.
*/
import sprintData from "../../../../../data/sprint_data.json";

const activeUsersByRepo = {};
const latestSprintByRepo = {};

// This finds the latest sprint per repo
Object.entries(sprintData).forEach(([repoName]) => {
  const match = repoName.match(/(.*)_sprint_(\d+)$/);
  if (!match) return;

  const baseRepo = match[1];
  const sprintNum = parseInt(match[2]);

  if (
    !latestSprintByRepo[baseRepo] ||
    sprintNum > latestSprintByRepo[baseRepo].sprint
  ) {
    latestSprintByRepo[baseRepo] = {
      sprint: sprintNum,
      fullKey: repoName,
    };
  }
});

// This builds active users per repo (latest sprint only)
Object.entries(latestSprintByRepo).forEach(([repoName, { fullKey }]) => {
  const repoData = sprintData[fullKey];
  const normalizedRepo = repoName.toLowerCase().trim();

  activeUsersByRepo[normalizedRepo] = new Set();

  if (repoData.issues) {
    Object.keys(repoData.issues).forEach(user =>
      activeUsersByRepo[normalizedRepo].add(user)
    );
  }

  if (repoData.pull_requests) {
    Object.keys(repoData.pull_requests).forEach(user =>
      activeUsersByRepo[normalizedRepo].add(user)
    );
  }

  if (repoData.commits) {
    Object.keys(repoData.commits).forEach(user =>
      activeUsersByRepo[normalizedRepo].add(user)
    );
  }
});

// USERS 

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
        .filter(user =>
          Object.values(activeUsersByRepo).some(set => set.has(user))
        )
      )
    )
  ];
};

export const getUniqueTeams = (lifetimeData) => {
  return ["All Teams", ...Object.keys(lifetimeData)];
};

export const getUsersByRepo = (lifetimeData, repo) => {
  if (repo === "All Teams" || !repo) {
    return getUniqueUsers(lifetimeData);
  }

  const normalizedRepo = repo.toLowerCase().trim();
  const repoData = lifetimeData[repo] || {};

  return [
    "all",
    ...Array.from(
      new Set([
        ...Object.keys(repoData.issues ?? {}),
        ...Object.keys(repoData.pull_requests ?? {}),
        ...Object.keys(repoData.commits ?? {})
      ].filter(user => activeUsersByRepo[normalizedRepo]?.has(user)))
    )
  ];
};

//TIME DATA 

export const buildTimeData = (lifetimeData, category, metric, user) => {
  const userValues = {};

  Object.entries(lifetimeData).forEach(([repoName, repo]) => {
    const normalizedRepo = repoName.toLowerCase().trim();
    const section = repo[category] ?? {};

    if (user === "all") {
      Object.entries(section).forEach(([username, metrics]) => {
        if (!activeUsersByRepo[normalizedRepo]?.has(username)) return;

        if (metrics[metric] != null) {
          if (!userValues[username]) userValues[username] = [];
          userValues[username].push(metrics[metric]);
        }
      });
    } else {
      if (
        activeUsersByRepo[normalizedRepo]?.has(user) &&
        section[user]?.[metric] != null
      ) {
        if (!userValues[user]) userValues[user] = [];
        userValues[user].push(section[user][metric]);
      }
    }
  });

  return Object.entries(userValues).map(([username, values]) => ({
    label: username,
    value: parseFloat(
      (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
    ),
  }));
};

//VOLUME DATA 

export const buildVolumeData = (lifetimeData, user) => {
  let issuesOpened = 0, issuesClosed = 0, prsOpened = 0, prsMerged = 0, commits = 0;

  Object.entries(lifetimeData).forEach(([repoName, repo]) => {
    const normalizedRepo = repoName.toLowerCase().trim();

    const issues = repo.issues ?? {};
    const prs = repo.pull_requests ?? {};
    const repoCommits = repo.commits ?? {};

    const addMetrics = (u) => {
      if (!activeUsersByRepo[normalizedRepo]?.has(u)) return;

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
};