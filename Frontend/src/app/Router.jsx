import { useRoutes } from 'react-router-dom';
import { Home } from '../features/home/routes/Home';
import { TeamStats } from '../features/team-stats/routes/TeamStats';

// Navigation routes for app
// Wrapping routes with ProtectedRoute so user must be logged in

export const AppRouter = () => {
  const routes = [
    { 
      path: '/', 
      element: <Home />,
    },
    { path: '/team-stats', 
      element: <TeamStats />,
    },
  ];

  const element = useRoutes(routes);

  return <>{element}</>;
};