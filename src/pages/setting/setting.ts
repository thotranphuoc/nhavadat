import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AppService } from '../../services/app.service';
import { AuthService } from '../../services/auth.service';
import { iSetting } from '../../interface/setting.interface';

import { SigninPage } from '../../pages/signin/signin';
import { HomePage } from '../../pages/home/home';
import { ProfilePage } from '../../pages/profile/profile';
import { FavoriteViewPage } from '../../pages/favorite-view/favorite-view';
import { SoldItemsViewPage } from '../../pages/sold-items-view/sold-items-view';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {
  mySettings: iSetting = {
    setHouse: true,
    setApartment: true,
    setLand: true,
    setOther: true,
    language: 'English'
  };
  isSigned: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appService: AppService,
    private authService: AuthService) {
      this.isSigned = this.authService.isSigned;
     }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  ionViewWillEnter() {
    this.mySettings = this.appService.getSetting();
    console.log(this.mySettings.setHouse);
  }

  ionViewWillLeave() {
    this.appService.updateSetting(this.mySettings);
    console.log(this.appService.getSetting());
  }

  go2SignIn(){
    this.navCtrl.push(SigninPage, { action: 'signIn'});
  }

  go2SignUp(){
    this.navCtrl.push(SigninPage, { action: 'signUp'});
  }

  go2ResetAccount(){
    this.navCtrl.push(SigninPage, { action: 'resetAccount'});
  }

  go2SignOut(){
    this.authService.signOut().then((data)=>{
      console.log('user signed out');
      this.appService.alertMsg('Alert', 'User just signed out');
      this.navCtrl.push(HomePage);
      this.authService.isSigned = false;
      this.isSigned = this.authService.isSigned;
    })
    // this.navCtrl.push(SigninPage, { action: 'signOut'});
  }

  go2ProfilePage(){
    console.log('edit profile page');
    this.navCtrl.push(ProfilePage);
  }

  go2FavoriteViewPage(){
    this.navCtrl.push(FavoriteViewPage, this.authService.uid);
  }

  go2SoldItemsViewPage(){
    this.navCtrl.push(SoldItemsViewPage, this.authService.uid);
  }

}
