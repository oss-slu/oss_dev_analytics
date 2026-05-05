export const buildBubbleData = (data) => {
  const contributors = {};

  Object.values(data).forEach((repo) => {
    // Issues
    Object.entries(repo.issues || {}).forEach(([user, stats]) => {
      if (!contributors[user]) contributors[user] = initUser(user);
      contributors[user].issuesClosed += Number(stats.total_issues_closed) || 0;
    });

    // PRs
    Object.entries(repo.pull_requests || {}).forEach(([user, stats]) => {
      if (!contributors[user]) contributors[user] = initUser(user);
      contributors[user].prsOpened += stats.total_prs_opened || 0;
    });

    // Commits
    Object.entries(repo.commits || {}).forEach(([user, stats]) => {
      if (!contributors[user]) contributors[user] = initUser(user);
      contributors[user].commits += stats.total_commits || 0;
      contributors[user].timeContributing += Number(stats.average_velocity) || 0;

    });
  });

  return Object.values(contributors);
};

const initUser = (name) => ({
  name,
  commits: 0,
  issuesClosed: 0,
  prsOpened: 0,
  timeContributing: 0,
});