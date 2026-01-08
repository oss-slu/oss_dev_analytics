import { useRoutes } from 'react-router-dom';
import { Home } from '../features/home/routes/Home';
import { TeamStats } from '../features/team-stats/routes/TeamStats';
//Navigation routes for app
/*
    Current Routes:
    - '/': Home Page
    - '/team-stats': Team Statistics Page
*/
export const AppRouter = () => {
  const routes = [
    { path: '/', element: <Home /> },
    { path: '/team-stats', element: <TeamStats /> },
  ];

  const element = useRoutes(routes);

  return <>{element}</>;
};