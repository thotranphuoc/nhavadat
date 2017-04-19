import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, Loading } from 'ionic-angular';

import { DbService } from '../../services/db.service';
import { AppService } from '../../services/app.service';
import { GmapService } from '../../services/gmap.service';
import { iPosition } from '../../interface/position.interface';
import { iSoldItem } from '../../interface/sold-item.interface';
declare var google:any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loading: any;
  btnLoadMarkerInvisible: boolean = true;
  maphome: any;
  soldItemsWithKey: { key: string, data: iSoldItem }[] = [];
  positionList: iPosition[] = [];
  userCurrentPosition: iPosition = { lat: 0, lng: 0 }

  @ViewChild('maphome') mapElement;
  constructor(
    private gmapService: GmapService,
    private dbService: DbService,
    private appService: AppService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });

    // this.getPostionList()
    //   .then((positions) => {
    //     console.log(positions);
    //     return this.gmapService.getCurrentLocationReturnPromise();
    //   })
    //   .then((position: iPosition) => {
    //     console.log(position, position.lat, position.lng);
    //     this.gmapService.initMapForElementIdWithCenterZoomType('maphome', position, 15);

    //   })
    //   .catch(err=>{
    //     console.log(err);
    //   })

    // this.gmapService.getCurrentLocationReturnPromise().then((position) => {
    //   console.log(position);
    //   return this.gmapService.initMapForElementIdWithCenterZoomType('maphome', position, 15);
    // }).then(() => {
    //   // setTimeout(()=>{
    //   //   this.loadMarker();
    //   // },5000);
    //   this.loadMarkers();
    // })

    platform.ready().then(() => {
      // this.initializeMap({lat: 0, lng: 0  });
    })
    this.soldItemsWithKey = this.dbService.getSoldItems();


  }

  ionViewWillEnter() {
    this.dbService.getSoldItemsFromFirebaseReturnArrayWithKey_Data('soldItems')
      .then((data) => {
        console.log(data);
      })
      .catch(err=>{
        this.appService.alertError('Erorr', err);
      })

    this.gmapService.getCurrentLocationReturnPromise()
      .then((currentPos: iPosition) => {
        this.userCurrentPosition = currentPos;
        console.log(this.userCurrentPosition);
        if(this.mapElement){
          console.log(this.mapElement, '<-- mapElement');
          this.startLoading();
          this.initializeMap(currentPos);
        }else{
          console.log('mapElement is null:', this.mapElement);
          this.appService.alertError('this.mapElement', this.mapElement);
        }
      })
      .catch(err => {
        console.log(err);
        this.appService.alertError('Erorr', err);
      })
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

  }

  // getPositionList() {
  //   return new Promise((resolve, reject) => {
  //     let items = []
  //     this.dbService.getSoldItemsFromFirebaseReturnArrayWithKey_Data('soldItems')
  //       .then((soldItems: any[]) => {
  //         console.log(soldItems);
  //         this.dbService.setSoldItems(soldItems);
  //         soldItems.forEach((position: { key: string, data: iSoldItem }) => {
  //           let item = {
  //             key: position.key,
  //             lat: position.data.POSITION.lat,
  //             lng: position.data.POSITION.lng
  //           }
  //           console.log(item);
  //           items.push(item);
  //         });
  //         this.positionList = items;
  //         console.log(this.dbService.getSoldItems());
  //         resolve(this.positionList);
  //         // resolve(positions);
  //       }, err => {
  //         reject(err);
  //       })
  //       .catch(err => {
  //         console.log(err)
  //         reject(err);
  //       })
  //   })
  // }

  initializeMap(position: iPosition) {
    // let latLng = new google.maps.LatLng(-34.99434, 138.5434);
    let mapOptions = {
      center: position,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // display map
    this.maphome = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    // maps is loaded fully
    google.maps.event.addListener(this.maphome, 'idle', () => {
      console.log('maps was loaded fully');
      this.hideLoading();
      this.loadMarkers();
      // make fab button visible
      this.btnLoadMarkerInvisible = false;
    })
  }


  getMarkers() {
    this.positionList = this.dbService.getUpdatedItemList();
  }

  loadMarkers() {

    // this.loading.present();
    console.log(this.positionList);
    this.soldItemsWithKey = this.dbService.getSoldItems();
    this.soldItemsWithKey.forEach(soldItemWithKey => {
      console.log(soldItemWithKey);
      this.gmapService.addMarkerToMapWithID(this.maphome, soldItemWithKey).then(() => {
        // do something after marker loaded
      });
    })
    // this.hideLoading();
    // setTimeout(() => {
    //   this.hideLoading();
    // }, 2000);
  }
  private startLoading(){
    this.loading.present();
  }
  private hideLoading() {
    this.loading.dismiss();
  }

}

// 1. get List of Item from Db
// 2. load the map
// 3. load marker with list from 1
// 


/*



 */