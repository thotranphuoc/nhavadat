import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { ShowItemDetailPage } from '../show-item-detail/show-item-detail';
import { iSoldItem } from '../../interface/sold-item.interface';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'page-popover-info',
  templateUrl: 'popover-info.html'
})
export class PopoverInfoPage {
  objKey: { key: string, data: iSoldItem} =null;
  obj: iSoldItem = null;
  data: any;

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private appService: AppService) {
                this.objKey = this.navParams.data;
                this.obj = this.objKey.data;
                console.log(this.obj);
                this.data = {
                  imgUrl: this.obj.PHOTOS[0],
                  price: this.appService.convertToCurrency(this.obj.PRICE.toString(),','),
                  dtSan: this.obj.GROUNDSQUARES,
                  dtSd: this.obj.USEDSQUARES
                }
              }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverInfoPage');
    console.log(this.data);
  }

  closePopover(){
    this.viewCtrl.dismiss();
  }

  goToDetail(){
    console.log('go to detailed page');
    this.navCtrl.push(ShowItemDetailPage, this.objKey)
  }

}