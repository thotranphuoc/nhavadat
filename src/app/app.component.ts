import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

// import firebase from 'firebase';
import { DbService } from '../services/db.service';

import { HomePage } from '../pages/home/home';
import { AddNewItemPage } from '../pages/add-new-item/add-new-item';
import { ShowItemDetailPage } from '../pages/show-item-detail/show-item-detail';
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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = WelcomePage;

  pages: Array<{title: string, component: any, icon: any}>;

  constructor(public platform: Platform, private dbService: DbService) {
    // firebase.initializeApp({
    //   apiKey: "AIzaSyC4NxrYYEzopXAcKvDQFE0vqlIY17w2YMg",
    //   authDomain: "menugo-9df18.firebaseapp.com",
    //   databaseURL: "https://menugo-9df18.firebaseio.com",
    //   storageBucket: "menugo-9df18.appspot.com"
    // });
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [

      { title: 'Home', component: HomePage, icon: 'ios-home-outline' },
      { title: 'New', component: AddNewItemPage, icon: 'ios-add-outline' },
      { title: 'Settting', component: SettingPage, icon: 'ios-cog-outline'}
      // { title: 'MapMain', component: MapMainPage },
      // { title: 'Item Detail', component: ShowItemDetailPage },
      // { title: 'Page One', component: Page1 },
      // { title: 'Page Two', component: Page2 },
      // { title: 'File', component: FilePage },
      // { title: 'Camera', component: CameraPage },
      // { title: 'Camera U&D', component: CameraUpThenGeturlPage},
      // { title: 'Camera ngZone', component: CameraNgzonePage},
      // { title: 'Camera Blob', component: CameraBlobPage},
      // { title: 'Promise', component: PromisePage}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      //just to test
      // this.loadDBFromFirebase();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }


//just to test
  loadDBFromFirebase(){
    let DBData = [];
    this.dbService.getSoldItemsFromFirebaseReturnArrayWithKey_Data('soldItems').then((data: any[])=>{
      console.log(data);
      this.dbService.setSoldItems(data);
      console.log(this.dbService.getSoldItems());
    }).catch((err)=>{
      console.log(err)
    })
  }
}
