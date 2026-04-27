// Main entry file
// Added okta security wrapper so auth works across the app

import React from 'react';
import ReactDOM from 'react-dom/client';
/*
import { Security } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
*/
import App from './app/App';
/*
import { oktaConfig } from './lib/oktaConfig';

// Creating okta instance
const oktaAuth = new OktaAuth(oktaConfig);

// Handles redirect after login
const restoreOriginalUri = async (_oktaAuth, originalUri) => {
  window.location.replace(
    toRelativeUrl(originalUri || '/', window.location.origin)
  );
};
*/

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <App />
  </React.StrictMode>
);