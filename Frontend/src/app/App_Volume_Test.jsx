import { AppProvider } from './Provider';
import { AppRouter } from './Router';
import { Navbar } from '../components/NavBar';
import { transformVolumeData } from '../utils/TransformVolumeData'; 
import test_data from '../../../Backend/test_data.json';
import VolumeCharts from '../components/charts/VolumeBased';

//Code used to test Volume based chart. Insert into App.jsx to view test output
function App() {
  const orgData = transformVolumeData(test_data, 'org', null, "All");
  const repoData = transformVolumeData(test_data, 'repo', null, "oss_dev_analytics");
  const userData = transformVolumeData(test_data, 'user', "hcaballero2", "oss_dev_analytics")
  return (
    <AppProvider>
      <Navbar />
      <main style={{ 
        padding: '20px', 
      }}>
      <VolumeCharts data ={orgData} repos={"All"}/>
      <VolumeCharts data ={repoData} repos={"oss_dev_analytics"}/>
      <VolumeCharts data ={userData} repos={"oss_dev_analytics"} user = {"hcaballero2"}/>
        <AppRouter />
      </main>
    </AppProvider>
  );
}

export default App;