/*
    Unit tests for the getTopContributorsAndRepos helper function

    These tests focus exclusively on verifying the correctness of
    counting and ranking logic for contributors and repositories.
    UI rendering is intentionally excluded to keep tests isolated 
    and easy to maintain.
*/ 
import { getTopContributorsAndRepos } from "../../../utils/getTopContributorsAndRepos";
import { describe, it, expect } from "vitest"; // to allow lint to pass

describe("getTopContributorsAndRepos", () => {
  // mock JSON data so that Lint passes
const mockJSON = {
    "repo1": {
      issues: { "alice": { total_issues_opened: 2 }, "bob": { total_issues_opened: 1 } },
      commits: { "alice": { total_commits: 3 } }
    },
    "repo2": {
      pull_requests: { "charlie": { total_prs_opened: 4 } }
    }
  };

  
  it("counts contributor activity and sorts correctly", () => {
    const {topContributors} = getTopContributorsAndRepos(mockJSON, 5);
    // alice should rank first since she appears twice
    expect(topContributors).toEqual([
      { name: "alice", count: 5 },
      {name: "charlie", count: 4 },
      { name: "bob", count: 1 },
    ]);
  });

  it("counts repository activity and sorts correctly", () => {
    const { topRepos } =
      getTopContributorsAndRepos(mockJSON, 5);

    // repo1 should rank higher since it appears more frequently
    expect(topRepos).toEqual([
      { name: "repo1", count: 6 },
      { name: "repo2", count: 4 },
    ]);
  });

  it("handles empty input without crashing", () => {
    const { topContributors, topRepos } =
      getTopContributorsAndRepos([], 5);

    expect(topContributors).toEqual([]);
    expect(topRepos).toEqual([]);
  });
});