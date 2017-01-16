import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import * as firebase from 'firebase';

import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

const firebaseConfig = {
  const firebaseConfig = {
    apiKey: "YOUR_APP_KEY",
    authDomain: "YOUR_APP_DOMAIN.firebaseapp.com",
    databaseURL: "https://YOUR_APP_DOMAIN.firebaseio.com",
    storageBucket: "YOUR_APP_DOMAIN.appspot.com"
  };
};

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
