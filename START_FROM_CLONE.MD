1) Using the Cloud Console create a new GCP cloud project. This will be used by Apps Script and for static hosting. Remember to setup your OAuth consent screen.
2) Using the firebase console create a firebase project from your cloud project. Initialize hosting to get the hosting URL for your firebase project.
3) Create a new standalone apps script project. Switch the project to the one set in step 1.
4) Edit .clasp.json. Add the Apps Script projectId.
5) Edit .firebaserc. Add the firebase project. 
6) Edit gulpfile.js. Set BASE_URL to the hosting URL from step 2.   
      6a) You can optionally add a firebase ci token to LOCAL_TOKEN in gulpfile.js if you want firebase to run as a different account as your logged in acccount. 
8) Edit the environment.ts/environment.prod.ts files in client/Angular-AppsScript-Starter/src/environments to update the assetBase to the hosted URL from step 2.
9) Make sure you authenticate to clasp and firebase-tools with an account that can access projects from step 1 and 2.
10) Run npm install in project root and in client/Angular-AppsScript-Starter
11) From project root directory run `gulp build`
12) From project root directory run `gulp deploy`
13) Run script from step 3 in 'Test as Add-on' in a new spreadsheet.
