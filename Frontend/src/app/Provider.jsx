/*import { BrowserRouter } from 'react-router-dom';*/

//AppProvider component to wrap the application with necessary providers
/* Used for:
    - Navigation Routing
    - add to as expands
*/
export const AppProvider = ({ children }) => {
  return <>{children}</>;
};

/*
<BrowserRouter basename={import.meta.env.BASE_URL}>
  {children}
</BrowserRouter>
*/