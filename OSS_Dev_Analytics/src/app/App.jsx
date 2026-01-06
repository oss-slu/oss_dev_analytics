import { AppProvider } from './Provider';
import { AppRouter } from './Router';
import { Navbar } from '../components/NavBar';

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