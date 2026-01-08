import { BrowserRouter } from 'react-router-dom';

//AppProvider component to wrap the application with necessary providers
/* Used for:
    - Navigation Routing
    - add to as expands
*/
export const AppProvider = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};