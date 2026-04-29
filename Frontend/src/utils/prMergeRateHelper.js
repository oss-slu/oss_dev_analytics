import lifetimeData from "../../../data/lifetime_data.json";
import sprintData from "../../../data/sprint_data.json";

export const getPRMergeRates = (team) => {
  const repoKey = team === "All Teams" ? null : team;

  const lifetimePRs = {};

  //  handle all teams properly
  Object.entries(lifetimeData).forEach(([repoName, repo]) => {
    if (repoKey && repoName !== repoKey) return;

    if (!repo.pull_requests) return;

    Object.entries(repo.pull_requests).forEach(([user, stats]) => {
      if (!lifetimePRs[user]) {
        lifetimePRs[user] = {
          total_prs_opened: 0,
          total_prs_merged: 0
        };
      }

      lifetimePRs[user].total_prs_opened += Number(stats.total_prs_opened || 0);
      lifetimePRs[user].total_prs_merged += Number(stats.total_prs_merged || 0);
    });
  });

  const sprintPRs = {};

  Object.entries(sprintData).forEach(([repoName, repo]) => {
    if (!repoName.includes("sprint")) return;

    if (repoKey && !repoName.startsWith(`${repoKey}_sprint_`)) return;

    if (!repo.pull_requests) return;

    Object.entries(repo.pull_requests).forEach(([user, stats]) => {
      if (!sprintPRs[user]) {
        sprintPRs[user] = {
          total_prs_opened: 0,
          total_prs_merged: 0
        };
      }

      sprintPRs[user].total_prs_opened += Number(stats.total_prs_opened || 0);
      sprintPRs[user].total_prs_merged += Number(stats.total_prs_merged || 0);
    });
  });

  const allUsers = Object.keys(sprintPRs);

  return Array.from(allUsers)
    .map((user) => {
      const lifetime = lifetimePRs[user];
      const sprint = sprintPRs[user];

      const lifetimeRate =
        lifetime?.total_prs_opened > 0
          ? Number(
              (
                lifetime.total_prs_merged /
                lifetime.total_prs_opened
              ).toFixed(2)
            )
          : 0;

      const sprintRate =
        sprint?.total_prs_opened > 0
          ? Number(
              (
                sprint.total_prs_merged /
                sprint.total_prs_opened
              ).toFixed(2)
            )
          : 0;

      return {
        contributor: user,
        lifetimeRate,
        sprintRate
      };
    })
    .filter((user) => user.lifetimeRate > 0 || user.sprintRate > 0);
};