Steps to implement Okta Verify 

Goals: Authenticate users using Okta, Link authenticated users to their GitHub accounts, manage sessions, support different access based on Tech lead versus Developer 

Arcitechture:  
- Frontend (React + Vite)  
- Handles login redirects and login page 
- Store session tokens securely  
    Caches: 
    - User profile (name, email, role)  
    - GitHub username  

Backend (API Server)  
- Validate tokens  
- Manage GitHub calls  
- Refresh github tokens if needed 
- Store user data in this format: 
    { 
    oktaUserId, 
    email, 
    role, 
    githubAccessToken, 
    githubUsername 
    } 

Okta:  
- Identity Provider  
- Handles authentication + MFA (Okta Verify)  
GitHub:  
- Authenticaion provider for repository access 

 

Implementation – dual authentication method 
- Primary Authentication → Okta (OIDC)  
- Secondary Authorization → GitHub (OAuth 2.0)  

 

How to implement step-by-step: 
- The user navigates to dashboard and if no valid session they are   redirected to Okta 
- User authenticates via Okta and completes Okta verify 
- Okta returns an ID token (JWT) and access token 
- Frontend: Token is stored in the memory and the user is redirected to the dashboard 
- Backend: verifies JWT using 	Okta public keys and extracted the users ID, email, and role  
- First time login: redirects the user to GitHub OAuth consent, user has to approve access and then backend recieves the Github access token 
- Backend uses users GitHub token to collect respository, commits, and metrics data. 

 

Order: User → Frontend → Okta → Frontend → Backend → GitHub 
1. User requests dashboard 
2. Redirect to Okta 
3. User logs in (+ MFA) 
4. Okta returns tokens 
5. Frontend sends token to backend 
6. Backend validates token 
7. If no GitHub link → redirect to GitHub OAuth 
8. GitHub returns access token 
9. Backend stores mapping 
10. User session established 

Session Duration:  
- Access Token: 1 hour  
- Session Timeout: 2 hours inactivity  
- Max Session Lifetime: 8 hours  
- Session resets if: User logs out or token expires and then user need to refresh the token or re-auth on Okta 


User protection and security:  
- Use HTTPS for all communications  
- Never expose GitHub tokens to frontend  
- Use secure cookies 

Okta app setup:  
- Select type as OIDC Web Application  
- Grant Types:  
    - Authorization Code  
    - Refresh Token  

Redirect URIs: 
    http://localhost:5173/callback 
	https://yourdomain.com/callback 

Callback URL: 
    https://your-backend.com/api/github/callback 

Summary:  
- Okta = Authentication (OIDC)  
- GitHub = Authorization (OAuth)  
- MFA handled entirely by Okta (no frontend implementation needed)  
- Tokens stored securely (no localStorage)  
- Backend owns GitHub communication  
- Sessions expire after inactivity and token limits  

 

Go to Okta website and “create new app” to start the setup 
https://login.okta.com/

