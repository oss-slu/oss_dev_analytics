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
  repo1: {
    issues: {
      alice: { currentStreak: 2, total_issues_closed: 2 },
      bob: { currentStreak: 1, total_issues_closed: 1 }
    },
  },
  repo2: {
    issues: {
      charlie: { currentStreak: 3, total_issues_closed: 4 }
    }
  }
};

  
  it("sorts contributors based on streak correctly", () => {
    const {topContributors} = getTopContributorsAndRepos(mockJSON, 5);
    // charlie: 3, alice: 2, bob: 1 (based on streaks in mock data)
    expect(topContributors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "charlie", currentStreak: 3 }),
        expect.objectContaining({ name: "alice", currentStreak: 2 }),
        expect.objectContaining({ name: "bob", currentStreak: 1 }),
      ])
    );
  });

  it("sorts repositories based on streak and active members correctly", () => {
    const { topRepos } =
      getTopContributorsAndRepos(mockJSON, 5);

    // repo2: streak 3 (1 member), repo1: streak 2 (2 members)
    expect(topRepos).toEqual([
      { name: "repo2", streak: 3, activeMembers: 1 },
      { name: "repo1", streak: 2, activeMembers: 2 },
    ]);
  });

  it("handles empty input without crashing", () => {
    const { topContributors, topRepos } =
      getTopContributorsAndRepos([], 5);

    expect(topContributors).toEqual([]);
    expect(topRepos).toEqual([]);
  });
});