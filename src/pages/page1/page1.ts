import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DbService } from '../../services/db.service';


@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
  items =[];
  constructor(public navCtrl: NavController, private dbService: DbService) {}

  ionViewWillEnter(){
    // this.items = this.dbService.getItems();
    console.log(this.items);
  }
}
