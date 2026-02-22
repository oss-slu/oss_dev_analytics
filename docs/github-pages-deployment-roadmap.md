# GitHub Pages Deployment Research - React(Vite)

## Overview
The goal of this research is to see what would be required to deploy our React + Vite frontend to GitHub pages as the `oss-slu.github.io` domain for this issue, ensuring that we do not mess up routing, environment variables, or our data flow. Since this deployment is part of our final Capstone delivery, I wanted to focus on making sure that this document clearly explains the configuration changes that we need, any potential issues (especially with SPA routing), and how the backend generated data will connect with the hosted dashboard. 

## 1. Hosting Strategy: Project Pages vs. Root Pages
There are two primary methods we can use to host our frontend on GitHub Pages and I have done some research on both options. 

### Option A - Project Pages (Most Realistic for Us)

**URL format:**
https://oss-slu.github.io/<REPO_NAME>/

This is the standard setup if our frontend is located within a typical repository (like `oss_dev_analytics`). In this case, the site is hosted in a subdirectory that corresponds to the repository name. If we choose this option, then we must set the Vite 'base' property correctly to make sure our static assets load from the appropriate subpath. 

In `vite.config.js`:
```js
export default defineConfig({
    plugins: [react()],
    base: "/<REPO_NAME>/",
})
```

If the base property is not configured correctly, then our CSS, JavaScript, and other assets will fail in production even if everything functions well locally. 

### Option B - Root Organization Pages
**URL format:**
https://oss-slu.github.io/


In order to make this setup function properly, the repository needs to be named exactly: 
oss-slu.github.io

If that is the case, the Vite would simply be:<br>
base: "/"

While this technically does work, unless we decide to set up and manage a separate root repository only for the deployed site, Project Pages seems to be more practical and aligns better with our current structure. 

## 2. Deployment Workflow (GitHub Actions)
Since GitHub pages only serves static files, the deployment must adhere to a build to deploy process. 

The workflow would look roughly like this:<br>
1. Push changes to main
2. A GitHub Action triggers automatically
3. Install dependencies
4. Run this command:
`npm run build`

Deploy the generated dist/ folder to GitHub Pages. This results in:<br>
- Automatic deployment
- Consistent builds
- No manual publishing steps

We can choose to deploy a gh-pages branch or use GitHub's official Pages deployment via Actions. I think that using GitHub Actions would keep everything organized and in sync with our CI/CD workflow. 

## 3. Environment Variables
Since GitHub Pages is a static hosting service, the environment variables get injected at the time of building.

In Vite:<br>
- Only the variables that start with VITE_ are available to the frontend.
- You can access them like this: `import.meta.env.VITE_API_BASE_URL`

If we need to keep sensitive information safe, we can: <br>
- Add them as secrets in the GitHub repository
- Inject them during the build step in GitHub Actions

If our API endpoints change often and we want to avoid rebuilding them every time, we could also use a runtime config.json file instead of hardcoding the endpoints into the bundle. 

## 4. React Router and 404 Handling (SPA Issue)
Since our dashboard relies on client-side routing, refreshing nested routes can lead to 404 errors on GitHub Pages. 

For example, if you refresh `/teams` it might give you a 404 error because GitHub Pages looks for a physical `/teams` file. 

### Solution
To fix this, we would have to create a `404.html` file in the `public/` directory that redirects the users back to the `index.html`. 

As Vite copies everything from `public/` into the production build, this guarantees us that: <br>
- Refreshing nested routes functions properly
- Direct navigation works smoothly
- Client-side routing remains unaffected

If we skip this step, then refreshing any route that is not the root will cause the application to break. 

## 5. Managing test_data.json
We also need a reliable method to manage test_data.json in a hosted setting.

### Option 1 - Bundle Static JSON (Easiest)
Put the file in: `public/data/test_data.json`

Then retrieve it using: `fetch(${import.meta.env.BASE_URL}data/test_data.json)`

Using BASE_URL makes sure it works both:
- Locally `(/)`
- On GitHub Pages `(/<REPO_NAME>/)

This keeps the behavior consistent between local and production.

### Option 2 - Replace with Backend API
Instead of using static JSON, we could pull data straight from the backend with `import.meta.env.VITE_API_BASE_URL`

This would connect the frontend directly to the backend service.

### Option 3 - Backend Workflow Updates JSON (Strong Capstone Approach)
For our final delivery, a solid strategy would be:
1. Backend workflow creates updated repository analytics data
2. It commits the updates JSON into `public/data/`
3. That commit triggers a GitHub Pages deployment
4. The hosted dashboard refreshes automatically

This keeps the deployed dashboard in sync with backend processing while ensuring automation. 

## 6. Verification Checklist
Before finalizing development, we need to make sure to check:
- Static assets are loading as it is supposed to
- The Vite base path is set up correctly
- Refreshing nested routes does not lead to 404 errors
- Data is loading correctly in production
- GitHub Actions deploys automatically when we push
- The site is reachable at the oss-slu.github.io domain

## Overall Recommendations
From this research, I recommend:
- Utilizing Project Pages
- Setting the right base path in Vite
- Including a SPA-friendly `404.html`
- Saving data in `public/data/`
- Employing GitHub Actions for automated development
- Connecting backend workflows to refresh hosted data

This method makes sure that deployment is automated, scalable, and in sync with our backend data collection process while also keeping the dashboard stable and easy to access. 