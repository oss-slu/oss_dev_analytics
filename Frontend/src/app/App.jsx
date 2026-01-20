import { AppProvider } from './Provider';
import { AppRouter } from './Router';
import { Navbar } from '../components/NavBar';
import { transformVolumeData } from '../utils/TransformVolumeData'; 
import test_data from '../../../Backend/test_data.json';
import VolumeCharts from '../components/charts/VolumeBased';
function App() {

  return (
    <AppProvider>
      <Navbar />
      <main style={{ 
        padding: '20px', 
      }}>
        <AppRouter />
      </main>
    </AppProvider>
  );
}

export default App;