import { useRoutes } from 'react-router-dom';
import { Home } from '../features/home/routes/Home';
import { TeamStats } from '../features/team-stats/routes/TeamStats';


import ProtectedRoute from '../components/auth/ProtectedRoute';

// Navigation routes for app
// Wrapping routes with ProtectedRoute so user must be logged in

export const AppRouter = () => {
  const routes = [
    { 
      path: '/', 
      element: (
        <ProtectedRoute>
          <Home /> 
        </ProtectedRoute>
      ),
    },
    { path: '/team-stats', 
      element: (
        <ProtectedRoute>
          <TeamStats /> 
        </ProtectedRoute>
      ),
    },
  ];

  const element = useRoutes(routes);

  return <>{element}</>;
};