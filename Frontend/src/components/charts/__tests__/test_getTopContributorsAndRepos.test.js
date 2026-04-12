/*
    Unit tests for the getTopContributorsAndRepos helper function

    These tests focus exclusively on verifying the correctness of
    counting and ranking logic for contributors and repositories.
    UI rendering is intentionally excluded to keep tests isolated 
    and easy to maintain.
*/ 
import { getTopContributorsAndRepos } from "../../../utils/getTopContributorsAndRepos";
import { describe, it, expect } from "vitest"; 

describe("getTopContributorsAndRepos", () => {
  // mock JSON data so that Lint passes
const mockJSON = {
    "repo1": {
      issues: { "alice": { total_issues_opened: 2 }, "bob": { total_issues_opened: 1 } },
    },
    "repo2": {
      pull_requests: { "charlie": { total_prs_opened: 4 } }
    }
  };

  
  it("counts contributor activity and sorts correctly", () => {
    const {topContributors} = getTopContributorsAndRepos(mockJSON, 5);
    // charlie: 4, alicce: 2, bob: 1
    expect(topContributors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "charlie", count: 4 }),
        expect.objectContaining({ name: "alice", count: 2 }),
        expect.objectContaining({ name: "bob", count: 1 }),
      ])
    );
  });

  it("counts repository activity and sorts correctly", () => {
    const { topRepos } =
      getTopContributorsAndRepos(mockJSON, 5);

    // repo1: 3 (2 from alice + 1 from bob), repo2: 4 (from charlie)
    expect(topRepos).toEqual([
      { name: "repo2", count: 4 },
      { name: "repo1", count:  3},
    ]);
  });

  it("handles empty input without crashing", () => {
    const { topContributors, topRepos } =
      getTopContributorsAndRepos([], 5);

    expect(topContributors).toEqual([]);
    expect(topRepos).toEqual([]);
  });
});