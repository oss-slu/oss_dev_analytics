import { useRoutes } from 'react-router-dom';
import { Home } from '../features/home/routes/Home';
import { TeamStats } from '../features/team-stats/routes/TeamStats';
<<<<<<< feature/actionable-insights-logic

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
=======
import Login from "../features/login/routes/Login";
/*
    Current Routes:
    - '/': Home Page
    - '/team-stats': Team Statistics Page
*/
export const AppRouter = () => {
  const routes = [
    { path: "/", element: <Home /> },
    { path: "/team-stats", element: <TeamStats /> },
    { path: "/login", element: <Login /> },
>>>>>>> main
  ];

  const element = useRoutes(routes);

  return <>{element}</>;
};