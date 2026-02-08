// Home dashboard page
// Shows org-level overview using existing components

import TopContributorsRepos from "../../../components/TopContributorsRepos";
import VolumeChart from "../../../components/charts/VolumeBased";

import testData from "../../../test_data.json";
import { transformVolumeData } from "../../../utils/TransformVolumeData";

export const Home = () => {
  const volumeData = transformVolumeData(testData.events);

  return (
    <div>
      <h1>Organization Overview</h1>

      {/* Top contributors & repositories */}
      <section
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <TopContributorsRepos />
      </section>

      {/* Existing volume chart (already on main) */}
      <section
        style={{
          display: "flex",
          gap: "20px",
        }}
      >
        <VolumeChart data={volumeData} />
      </section>
    </div>
  );
};