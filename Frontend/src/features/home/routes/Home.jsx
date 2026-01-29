// Home dashboard page
// Shows org-level overview using existing components

import TopContributors from "../../../components/TopContributors";
import TopRepositories from "../../../components/TopRepositories";
import VolumeChart from "../../../components/charts/VolumeBased";
import TimeBasedChart from "../../../components/charts/TimeBasedChart";

import testData from "../../../Frontend/test_data.json";
import { transformVolumeData } from "../../../utils/TransformVolumeData";

export const Home = () => {

  // Pulling org-wide data from test_data.json
  // Keeping this high-level (no repo or user specific filtering here)

  const contributors = testData.contributors;
  const repositories = testData.repositories;

  // Preparing data for charts
  // Volume chart needs transformed data
  const volumeData = transformVolumeData(testData.events);

  // Time based chart can directly use event timeline
  const timeSeriesData = testData.events;

  return (
    <div>
      <h1>Organization Overview</h1>

      {/* Top level summary section */}
      <section
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <TopContributors data={contributors} />
        <TopRepositories data={repositories} />
      </section>

      {/* Trend and activity charts */}
      <section
        style={{
          display: "flex",
          gap: "20px",
        }}
      >
        <TimeBasedChart data={timeSeriesData} />
        <VolumeChart data={volumeData} />
      </section>
    </div>
  );
};