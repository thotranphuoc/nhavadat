# ionic2-firebase-js-sdk
Step 1: Create new project with ionic-cli. Make sure "npm install -g ionic cordova" run already:
  ionic start --v2 ionic2-firebase-js-sdk sidemenu
  
Step 2: Update the "@ionic/app-scripts" to the lastest version:
  npm install @ionic/app-scripts@latest --save
  
Step 3: add firebase libruary:
  npm install firebase --save
  
Step 4: bootstrap firebase in app.module.ts file:
  import * as firebase from 'firebase';

  import { MyApp } from './app.component';
  import { Page1 } from '../pages/page1/page1';
  import { Page2 } from '../pages/page2/page2';

  const firebaseConfig = {
    apiKey: "YOUR_APP_KEY",
    authDomain: "YOUR_APP_DOMAIN.firebaseapp.com",
    databaseURL: "https://YOUR_APP_DOMAIN.firebaseio.com",
    storageBucket: "YOUR_APP_DOMAIN.appspot.com"
  };

  firebase.initializeApp(firebaseConfig);

  @NgModule({
  ...
  })
  
Step 5: import firebase into each file you want to call firebase:
  import * as firebase from 'firebase';
  
REMEMBER: you need to create an firebase account.
If you have any problem with these code, please feel free to contact me @: thotranphuoc@outlook.com


