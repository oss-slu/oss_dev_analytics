import { AppProvider } from './Provider';
import { Navbar } from '../components/NavBar';

import TimeBased from '../components/charts/TimeBased';
import testData from '../Backend/test_data.json';

// Code used to test TimeBased chart.
// Uses repo-level and sprint-level data from test_data.json
function AppTimeBasedTest() {

  const lifetimeRepo = testData.oss_dev_analytics;
  const sprintRepo = testData.oss_dev_analytics_sprint_7;

  // Helper to sum commits across contributors
  const sumCommits = (commitsObj = {}) =>
    Object.values(commitsObj).reduce(
      (sum, user) => sum + (user.total_commits || 0),
      0
    );

  // Convert repo + sprint into TimeBased-compatible data
  const timeTestData = [
    {
      time: 'Lifetime',
      value: sumCommits(lifetimeRepo.commits),
    },
    {
      time: 'Sprint 7',
      value: sumCommits(sprintRepo.commits),
    },
  ];

  return (
    <AppProvider>
      <Navbar />
      <main style={{ padding: '20px' }}>
        <TimeBased
          data={timeTestData}
          xKey="time"
          yKey="value"
          title="OSS Dev Analytics – Commits Over Time"
        />
      </main>
    </AppProvider>
  );
}

export default AppTimeBasedTest;