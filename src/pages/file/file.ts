import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AppService } from '../../services/app.service';

import {FileChooser} from 'ionic-native';

/*
  Generated class for the File page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-file',
  templateUrl: 'file.html'
})
export class FilePage {

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              private appService: AppService) {
    let fileButton = document.getElementById('fileButton');
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilePage');
  }

  chooseFile(e){
    FileChooser.open()
    .then(uri=>{
      console.log(uri);
      this.appService.alertMsg('uri', uri);
    })
    .catch(e=>{
      this.appService.alertMsg('error:', e);
    })

    // let file = e.target.files[0];
    // console.log(file);
    // console.log(file.name);
  }

}
