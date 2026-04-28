import './index.css';
import { AppProvider } from './Provider';
import { AppRouter } from './Router';
import { Navbar } from '../components/NavBar';
import { HashRouter } from 'react-router-dom'; // to fix 404 on refresh
function App() {
  return (
    <AppProvider>
      <HashRouter>
      <Navbar />

      <main 
        style={{ 
          padding: '20px', 
        }}
      >
         <AppRouter />
      </main>
      </HashRouter>
    </AppProvider>
  );
}

export default App;