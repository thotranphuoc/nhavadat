import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { AppService } from '../services/app.service';
import { DbService } from '../services/db.service';
import { CameraService } from '../services/camera.service';
import { GmapService } from '../services/gmap.service';
import { AuthService } from '../services/auth.service';

import * as firebase from 'firebase';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AddNewItemPage } from '../pages/add-new-item/add-new-item';
import { ShowItemDetailPage } from '../pages/show-item-detail/show-item-detail';
import { PopoverInfoPage } from '../pages/popover-info/popover-info';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { PromisePage } from '../pages/promise/promise';
import { MapMainPage } from '../pages/map-main/map-main';
import { WelcomePage } from '../pages/welcome/welcome';
import { FilePage } from '../pages/file/file';
import { CameraPage } from '../pages/camera/camera';
import { CameraUpThenGeturlPage } from '../pages/camera-up-then-geturl/camera-up-then-geturl';
import { CameraNgzonePage } from '../pages/camera-ngzone/camera-ngzone';
import { CameraBlobPage, ItemComponent } from '../pages/camera-blob/camera-blob';
import { SettingPage } from '../pages/setting/setting';
import { SigninPage } from '../pages/signin/signin';
import { ProfilePage } from '../pages/profile/profile';
import { FeedbackPage } from '../pages/feedback/feedback';
import { FeedbackDetailPage } from '../pages/feedback-detail/feedback-detail';
import { LoginPage } from '../pages/login/login';
import { FavoriteViewPage } from '../pages/favorite-view/favorite-view';
import { SoldItemsViewPage } from '../pages/sold-items-view/sold-items-view';
const firebaseConfig = {
  
    apiKey: "AIzaSyAf1-QYPFKYvSP4zsgd1rAPgGv_vsEWCzE",
    authDomain: "auth-38cb7.firebaseapp.com",
    databaseURL: "https://auth-38cb7.firebaseio.com",
    storageBucket: "auth-38cb7.appspot.com",
    messagingSenderId: "304243304728"
};

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddNewItemPage,
    SettingPage,
    SigninPage,
    ProfilePage,
    ShowItemDetailPage,
    PopoverInfoPage,
    MapMainPage,
    WelcomePage,
    FilePage,
    CameraPage,
    CameraUpThenGeturlPage,
    CameraNgzonePage,
    CameraBlobPage,
    ItemComponent,
    Page1,
    Page2,
    PromisePage,
    FeedbackPage,
    FeedbackDetailPage,
    LoginPage,
    FavoriteViewPage,
    SoldItemsViewPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddNewItemPage,
    SettingPage,
    SigninPage,
    ProfilePage,
    ShowItemDetailPage,
    PopoverInfoPage,
    MapMainPage,
    WelcomePage,
    FilePage,
    CameraPage,
    CameraUpThenGeturlPage,
    CameraNgzonePage,
    CameraBlobPage,
    ItemComponent,
    Page1,
    Page2,
    PromisePage,
    FeedbackPage,
    FeedbackDetailPage,
    LoginPage,
    FavoriteViewPage,
    SoldItemsViewPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
            AppService,
            DbService,
            CameraService,
            GmapService,
            AuthService
            ]
})
export class AppModule {}
