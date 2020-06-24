1) Using the Cloud console create a new GCP cloud project. This will be used by Apps Script and for static hosting. Remember to setup your OAuth consent screen.
2) Using the firebase console create a firebase project from your cloud project. Initialize hosting to get the hosting URL for your firebase project.
3) Create a new standalone apps script project. Switch the project to the one set in step 1.
4) Edit .clasp.json. Add the Apps Script projectId.
5) Edit .firegbaserc. Add the firebase project. 
6) Edit gulpfile.js. Set BASE_URL to the hosting URL from step 2. 
7) Make sure you authenticate to clasp and firebase-tools with an account that can access projects from step 1 and 2.
8) From project root directory run `gulp build`
9) From project root directory run `gulp deploy`
10) Run script from step 3 in 'Test as Add-on' in a new spreadsheet.
