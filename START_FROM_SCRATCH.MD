# Modern Angular in Google Apps Script

## Who is this for?
I intend this repo for established Add-on developers who want to use modern Angular in GSuite editor Add-ons and Google 
Apps Script webapps. This repo does not attempt do show how to create Add-ons or Angular apps, but tooling and build process
to use Angular apps in Add-ons. I am also assuming familiarity with installing and using CLI tools in your development 
workflow. 

### High level overview of integration of Angular apps in Google Apps Script  
There are two major components to integrating Angular and Apps Script. First is the Apps Script project that will 
bootstrap the Angular app and hold the necessary triggers to integrate with the Add-on framework. The second a
static hosting service will serve the static assets created in the Angular build process.  In this repo I use firebase
hosting.  
  
You may wish to use the Apps Script project as your clients backend or use other services such as Firebase
Functions or App Engine.  With this method you are not bound to a particular backend for your Add-on. If you wish you
can use the bare minimum of triggers in the App Script project and develop your backend the same way you would for any
other Angular application.
##Setup
### Tools needed  

https://github.com/nodejs/node (I recommend using Node Version Manager https://github.com/nvm-sh/nvm)   
https://github.com/google/clasp/  
https://github.com/angular/angular-cli  
https://github.com/gulpjs/gulp  
https://github.com/firebase/firebase-tools (If you choose firebase hosting for static hosting)

`These tools are listed in devDependencies and will be installed when you do an npm install. To run the local dev
versions prefix with 'npx' such as 'npx ng new MyNewProject'`

### Project Structure  
1) Create a new GCP cloud project. This will be used by Apps Script and for static hosting.  Remember to setup your 
OAuth consent screen. 
2) Initialize this GCP project as a firebase project in the firebase console.    
3) Create a root project folder. This will hold both your Angular application, and the App Script server code.  
4) Initialize firebase for the project.  Select the project you created in step 1 and select hosting.  For your public
directory select `deploy/public`.  Select the default value of No for overwrite url.  
Edit your firebase.json and add the following CORS options to your hosting options:  
    `"headers": [ {
          "source": "**/*.*",
          "headers": [ {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          } ]}],`  
          Note: This is highly permissive and any origin can access these static assets.  If you want you can later 
          restrict this to published origin i.e. `https://n-****-script.googleusercontent.com`

5) Create an Apps Script Project via clasp. Ensure it is standalone. In the apps script IDE change the project to the 
one created in step 1.  
6) Add `"rootDir": "deploy/build"` to your .clasp.json. Create a `.claspignore` it can be empty. 
7) Make a folder called `server`.  Browse to the folder. Run `clasp pull`. This folder will hold all your App Script 
source files.
8) Add the example `server/server.js` code from this repo into your `code.js`. Rename `code.js` it if you wish. It is a very basic 
example using the bare minimum needed to bootstrap a spreadsheet add-on.  
9) Back in project root create a folder called `client`. Browse to client folder. Create a new Angular app using `ng new "YourAppName"`
 Add angular routing and Choose css tooling of choice when prompted by the cli.   
 10) Some files Angular files need to be updated. 
     ##### src/index.html  
     Add the following snippet to the HEAD node  
     `<script>  
          const hash = '<?= route?>';  
          if(!hash.includes('route')){  
            window.location.hash = hash;  
          }  
        </script>`  
        
       The snippet above allows for sidebars to be able to launch Apps Script dialog boxes. AppsScript dialog boxes are 
       external to the sidebar. Angular dialog boxes are nested in the sidebar or Apps Script dialog boxes in which they
        are created. 
      ##### src/app/app-routing.modules.ts  
      App Script cannot use URL routing but can use hash routing. Add `useHash: true` to the RouterModule config object.  
      i.e. ` imports: [RouterModule.forRoot(routes, {useHash: true})],`  
      
      Add a starter component and link it in your app router.   
      `ng generate component Sidebar`  
      `const routes: Routes = [
        { path: '**', component: SidebarComponent },
      ];`
      
     ##### src/app/app.component.html
        Modify your app.component.html make sure to include `<router-outlet></router-outlet>`. Any html in this component is 
universal to the Add-on. Your selected route component is rendered where <router-outlet> is located.  
####src/environments/(environment.ts | environment.prod.ts)  
Add the object  `assetBase` : 'https://yourFirebaseProject.web.app/assets/'.  
Add all static files such as images to the `src/assets` folder. You can add subfolders as you seem fit 
such as `src/assets/images` or `src/assets/videos`. In your components that require these static assets 
import the environment object into the .ts file and refrence it in the html template such as `<img [src]="env.assetBase + 'images/logo.png'"  >` 
  

### Build and deploy
##### Modify the gulpfile.js
BASE_URL: Is the URL to the firebase host address. Used for static assets. i.e. `https://yourFirebaseProject.web.app`;  
PROJECT_NAME: is the name you game the client when you used `ng new youProjectName`  
LOCAL_TOKEN: `yourCICDToken`  Generate using `firebase login:ci` or if you want to use the user account currently
logged into firebase tools leave empty;  

#### Build
Run `gulp build`.  
This will do a production build of the Angular application and move all the appropriate client and server files into a
folder named `deploy` situated in the root of the project. Files in the `deploy/build` folder are for Apps Script.  
Files in the `deploy/public` folder are for firebase hosting.


#### Deploy
Run `gulp deploy`  
If firebase-tools and clasp are configured correctly the files will be deployed to firebase hosting and Apps Script.  
If you have firebase errors on deploy: 
1) Check you authenticated to firebase-tools via `firebase login` or has set the CI token in gulpfile.js.  
2) Make sure firebase.json lists the correct project as the default project. 
3) Make sure the account used has access to the firebase project.  

If you have clasp errors on deploy:
1) Ensure you have enabled api access at script.google.com  
2) Check you have authenticated to clasp via `clasp login`.
3) Make sure .clasp.json is pointing to the correct Apps Script project.  
4) Make sure the authenticated user has access to the project.  

#### A note on editor dialogs
To open a dialog in Apps Script it needs to be listed as a route in your app-routing.module.ts.  To open the dialog call 
`google.script.run.showDialog(routeName);` 


#### Development and Testing
There are two ways to do development. The first is to use `ng serve` to get a live update dev environment. You WILL need
to wrap any `script.google.run` with an appropriate alternate call to your backend, the `production` flag in the 
environment file works fine for this. No UI functions such as creating menu items or open editor dialog boxes will work.  
When happy you can build and deploy. The second is to skip the live environment and do a build/deploy at each step and 
watch all code changes in the `Test as Add-on` environment. Since build/deploy times are quite fast this is a valid option.
Personally I will rough out my UI in ng serve live environment mode and switch to a build/deploy model while working on 
business logic. Either way you will be using `Test as Add-on`.   
You also have the ability to do automated testing as the Angular cli includes tests for each component it generates.  
Check out the Angular docs to learn more about that.

#### Notes:
This write-up is rough. It might not be clear. It is intended for devs that already are comfortable with modern dev tools and 
the Apps Script environment. Angular is a bit of a learning curve, but is very much worth learning
if you want to develop complex applications. I used Node 12 locally.

 
 
