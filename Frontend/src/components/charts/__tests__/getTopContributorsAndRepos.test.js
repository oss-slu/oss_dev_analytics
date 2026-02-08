import { getTopContributorsAndRepos } from "../../../utils/getTopContributorsAndRepos";

// Tests for ranking logic used by TopContributorsRepos component
// Keeping these tests focused on counting and ordering only

describe("getTopContributorsAndRepos", () => {
  it("counts contributor activity and sorts correctly", () => {
    const events = [
      { author: "alice", repo: "repo1" },
      { author: "bob", repo: "repo1" },
      { author: "alice", repo: "repo2" },
    ];

    const { topContributors } =
      getTopContributorsAndRepos(events, 5);

    // alice should come first since she appears twice
    expect(topContributors).toEqual([
      { name: "alice", count: 2 },
      { name: "bob", count: 1 },
    ]);
  });

  it("counts repository activity and sorts correctly", () => {
    const events = [
      { author: "alice", repo: "repo1" },
      { author: "bob", repo: "repo1" },
      { author: "charlie", repo: "repo2" },
    ];

    const { topRepos } =
      getTopContributorsAndRepos(events, 5);

    // repo1 should be ranked higher since it appears more often
    expect(topRepos).toEqual([
      { name: "repo1", count: 2 },
      { name: "repo2", count: 1 },
    ]);
  });

  it("handles empty input without crashing", () => {
    const { topContributors, topRepos } =
      getTopContributorsAndRepos([], 5);

    expect(topContributors).toEqual([]);
    expect(topRepos).toEqual([]);
  });
});