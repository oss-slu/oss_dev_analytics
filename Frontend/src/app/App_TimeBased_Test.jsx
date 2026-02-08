import { AppProvider } from './Provider';
import { Navbar } from '../components/NavBar';

import TimeBased from '../components/charts/TimeBased';

// Code used to test TimeBased chart.
// Temporary test file to verify visual output
function AppTimeBasedTest() {

  // Can you use the sprints rather than these mock values? It is great that you did mock values!! But the format of the json file will be repo_sprint_# for a specific repo data at a specific sprint or just labled repo for lifetime data
  // Simple mock data for time-based chart 
  const timeTestData = [
    { time: '2026-01-01', value: 10 },
    { time: '2026-01-02', value: 18 },
    { time: '2026-01-03', value: 7 },
    { time: '2026-01-04', value: 22 }
  ];

  return (
    <AppProvider>
      <Navbar />
      <main style={{ padding: '20px' }}>
        <TimeBased
          data={timeTestData}
          xKey="time"
          yKey="value"
          title="Time-Based Chart (Test Output)"
        />
      </main>
    </AppProvider>
  );
}

export default AppTimeBasedTest;