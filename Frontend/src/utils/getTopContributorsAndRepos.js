/*
    Helper function to compute the top contributors and top repositories
    based on aggregated lifetime data JSON.

    Params:
        lifetimeData (Object): The nested JSON object containing org-wide data.
        topN (number): Maximum number of contributors and repositories to return.
    
    Returns:
        Object: An object containing two arrays:
            - topContributors: Array of { name, count } objects
            - topRepos: Array of { name, count } objects
 */

import sprintData from "../../../data/sprint_data.json";

const activeUsersByRepo = {};
const latestSprintByRepo = {};

// STEP 1: find latest sprint for each repo
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

// STEP 2: build active users ONLY from latest sprint
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

/*const activeUsers = new Set();

Object.values(sprintData).forEach(repo => {
  if (repo.issues) {
    Object.keys(repo.issues).forEach(user => activeUsers.add(user));
  }
  if (repo.pull_requests) {
    Object.keys(repo.pull_requests).forEach(user => activeUsers.add(user));
  }
  if (repo.commits) {
    Object.keys(repo.commits).forEach(user => activeUsers.add(user));
  }
});*/


export function getTopContributorsAndRepos(lifetimeData, topN, selectedRepo) {
  const contributorStats = {};
  const repoStats = {};
  const contributorIssuesClosed = {};
  const contributorCurrentStreaks = {};
  const repoHighestStreaks = {};
  const repoActiveStreakMembers = {};

  // Safely handle empty data
  if (!lifetimeData) return { topContributors: [], topRepos: [] };

  // Iterate through every repository in the organization
  Object.entries(lifetimeData).forEach(([repoName, repoData]) => {
    if (selectedRepo && repoName !== selectedRepo) return;
    
    let repoTotalActivity = 0;
    let repoHighestStreak = 0;
    let repoActiveMembers = 0;

    // Helper to safely add metrics to a user's total and the repo's total
    const addActivity = (user, amount, isClosedIssue = false) => {
      const val = Number(amount) || 0;
      if (val > 0) {
        contributorStats[user] = (contributorStats[user] || 0) + val;
        repoTotalActivity += val;

        if (isClosedIssue) {
          contributorIssuesClosed[user] = (contributorIssuesClosed[user] || 0) + val;
        }
      }
    };

    const cleanedRepoName = repoName.toLowerCase().trim();
    const repoActiveUsers = activeUsersByRepo[cleanedRepoName];
      

    // Tally Issues (Opened + Closed)
    if (repoData.issues) {
      Object.entries(repoData.issues).forEach(([user, stats]) => {
        if (
          import.meta.env.MODE !== "test" &&
          (!repoActiveUsers || !repoActiveUsers.has(user))
        ) return;

        addActivity(user, stats.total_issues_opened);
        addActivity(user, stats.total_issues_closed, true);

        contributorCurrentStreaks[user] = Math.max(
          contributorCurrentStreaks[user] || 0,
          Number(stats.currentStreak) || 0
        );

        const userStreak = Number(stats.currentStreak) || 0;

        if (userStreak > 0) {
          repoActiveMembers += 1;
        }

        repoHighestStreak = Math.max(repoHighestStreak, userStreak);
      });
    }

    // Tally Pull Requests (Opened + Merged)
    if (repoData.pull_requests) {
      Object.entries(repoData.pull_requests).forEach(([user, stats]) => {
        if (
          import.meta.env.MODE !== "test" &&
          (!repoActiveUsers || !repoActiveUsers.has(user))
        ) return;

        addActivity(user, stats.total_prs_opened);
        addActivity(user, stats.total_prs_merged);
      });
    }

    // Add total repo activity to our tracker
    if (repoTotalActivity > 0) {
      repoStats[repoName] = (repoStats[repoName] || 0) + repoTotalActivity;
    }

    repoHighestStreaks[repoName] = repoHighestStreak;
    repoActiveStreakMembers[repoName] = repoActiveMembers;
  });

  // Sort contributors by streak first, then closed issues, then alphabetically
  const topContributors = Object.entries(contributorStats)
    .map(([name, count]) => ({ 
      name, 
      count,
      totalIssuesClosed: contributorIssuesClosed[name] || 0,
      currentStreak: contributorCurrentStreaks[name] || 0
    }))
    .sort((a, b) => 
      b.currentStreak - a.currentStreak ||
      a.name.localeCompare(b.name)
    )
    .slice(0, topN);

  // Sort repositories by highest streak first, then by how many members have a streak, then alphabetically
  const topRepos = Object.keys(repoHighestStreaks)
    .map((name) => ({
      name,
      streak: repoHighestStreaks[name] || 0,
      activeMembers: repoActiveStreakMembers[name] || 0
    }))
    .filter((repo) => repo.streak > 0)
    .sort((a, b) =>
      b.streak - a.streak ||
      b.activeMembers - a.activeMembers ||
      a.name.localeCompare(b.name)
    )
    .slice(0, topN);
  
return { topContributors, topRepos };
}