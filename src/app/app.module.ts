import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import * as firebase from 'firebase';

import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

const firebaseConfig = {
  apiKey: "AIzaSyBT8kacfD_SYp8Ei6TBcUEFlxnDK3GtYc0",
  authDomain: "businesscontacts-94792.firebaseapp.com",
  databaseURL: "https://businesscontacts-94792.firebaseio.com",
  storageBucket: "businesscontacts-94792.appspot.com"
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
