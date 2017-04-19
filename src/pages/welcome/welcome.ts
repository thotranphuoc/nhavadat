import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { MapMainPage } from '../map-main/map-main';
import { HomePage } from '../home/home';
import { DbService } from '../../services/db.service';


@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private loadingCtrl: LoadingController, 
              private dbService: DbService) {
    this.presentLoadingDefault();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  presentLoadingDefault(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    setTimeout(()=>{
      loading.dismiss();
      this.navCtrl.setRoot(HomePage);
    },1500)
  }

  

  

}
