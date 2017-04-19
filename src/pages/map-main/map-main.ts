import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { GmapService } from '../../services/gmap.service';
import { DbService } from '../../services/db.service';
import { iSoldItem } from '../../interface/sold-item.interface';

// declare var google:any;

@Component({
  selector: 'page-map-main',
  templateUrl: 'map-main.html'
})
export class MapMainPage {
  A = { lat: 10.8024579, lng: 106.6396198 };
  B = { lat: 11.5796669, lng: 104.7437253 };
  userPosition: any;
  ItemList: iSoldItem[] = [];
  SoldItemList: {key: string, data: iSoldItem}[] =[];
  @ViewChild('map') mapElement;
  map: any;
  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private gmapService: GmapService,
              private dbService: DbService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapMainPage');
    this.initMap();
    this.loadDBFromFirebase().then(()=>{
      this.loadMarkerToMap();
    })
    // this.loadDBFromFirebase().then((data)=>{
    //   console.log(data);
    // })
  }

  initMap(){
    let latLng = new google.maps.LatLng(0, 0);
    let mapOptions = {
      center: latLng,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
// OFF tam thoi
    // console.log(latLng);
    // let d = this.gmapService.getDistanceFrom2PointInKm(this.A.lat, this.A.lng, this.B.lat, this.B.lng);
    // console.log('distance between A & B:', d);

    // this.gmapService.nav2CurrentPostion(this.map);
    // this.gmapService.loadLocation(this.map);
    // // this.dbService.getLocationsFromFirebase();
    // this.dbService.getItemsFromFirebaseReturnArrayWithKey_Data('soldItems');
  }

  loadDBFromFirebase(){
    return new Promise((resolve, reject)=>{
      this.dbService.getSoldItemsFromFirebaseReturnArrayWithKey_Data('soldItems')
        .then((data: {key: string, data: iSoldItem}[])=>{
          console.log(data);
          this.SoldItemList = data;
          this.SoldItemList = this.dbService.getSoldItems();
          console.log(this.SoldItemList);
          console.log(typeof(data));
        })
        .catch(err=>console.log(err))

      resolve();
      reject();
    })

    
    
      // this.dbService.updateItemList(items);
      // this.ItemList = this.dbService.getUpdatedItemList();
      // console.log(this.ItemList);
      // resolve(items);
  }

  // loadDBFromFirebaseReturnArray(){
  //     this.dbService.getItemsFromFirebaseReturnArrayWithKey_Data('soldItems')
  //     .then((datas: any[])=>{
  //       datas.forEach(data=>{
  //         val
  //       })
  //     })
  // }

  loadMarkerToMap(){

    // console.log('start list')
    // this.SoldItemList.forEach((item: {key: string, data: iSoldItem})=>{
    //   console.log(item.key);
    //   return false;
    // })

    // this.SoldItemList.forEach(element => {
    //   console.log('test');
    // });
    this.SoldItemList = this.dbService.getSoldItems();
    console.log(this.SoldItemList);
    console.log(this.SoldItemList.length);
    this.SoldItemList.forEach(item => {
      console.log(item.key, item.data.POSITION.lat, item.data.POSITION.lng);
      console.log('test');
      // this.gmapService.addMarkerToMapWithID('map',item.data)
    })

  }

  

}
