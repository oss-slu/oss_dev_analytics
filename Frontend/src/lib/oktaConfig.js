// Keeping okta config in one place so it's easiser to manage
// Using env variables instead of hardcoding values

export const oktaConfig = {
    issuer: import.meta.env.VITE_OKTA_ISSUER, // Okta domain url
    clientId: import.meta.env.VITE_OKTA_CLIENT_ID, // App client id
    redirectUri: import.meta.env.VITE_OKTA_REDIRECT_URI, // After login redirect
    postLogoutRedirectUri: import.meta.env.VITE_OKTA_POST_LOGOUT_REDIRECT_URI, // After logout redirect
    scopes: ['openid', 'profile', 'email'], // Basic user info
    pkce: true, // Needed for secure frontend auth
};