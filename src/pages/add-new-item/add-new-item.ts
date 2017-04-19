import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, Loading, LoadingController, AlertController } from 'ionic-angular';
import { Camera, FilePath, File } from 'ionic-native';

import { GmapService } from '../../services/gmap.service';
import { DbService } from '../../services/db.service';
import { CameraService } from '../../services/camera.service';
import { AppService } from '../../services/app.service';
import { AuthService } from '../../services/auth.service';
import { iSoldItem } from '../../interface/sold-item.interface';
import { iPosition } from '../../interface/position.interface';
import { iProfile } from '../../interface/profile.interface';
import { ShowItemDetailPage } from '../show-item-detail';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';

declare var cordova: any;

@Component({
  selector: 'page-add-new-item',
  templateUrl: 'add-new-item.html'
})
export class AddNewItemPage {
  userProfile: iProfile = null;
  soldItem: iSoldItem = {
    UID: null,
    AVATAR_URL: null,
    NAME: null,
    PHONE: null,
    KIND: 'setHouse', // pho, chungcu, dat
    PRICE: null,
    GROUNDSQUARES: null,
    USEDSQUARES: null,
    FACILITIES: {
      hasSCHOOL: false,
      hasSCHOOLFAR: null,
      hasMART: false,
      hasMARTFAR: null,
      hasHOSPITAL: false,
      hasHOSPITALFAR: null,
      hasCENTER: false,
      hasCENTERFAR: null
    },
    ADDRESS: null,
    PHOTOS: [],
    POSITION: { lat: 0, lng: 0 },
    VISIBLE: true,
    POSTDATE: '2017/04/30'
  };

  tabChoice: any;
  isLocationSet: boolean = false;
  map: any;
  userLatLng: google.maps.LatLng;
  detectedUserPosition: iPosition = { lat: 0, lng: 0 };
  userPosition: any;
  userChosenPosition: any;
  userMarker: any;
  base64Image: string;
  base64Images: string[] = [];
  photoTaken: boolean = false;

  lastImage: string = null;
  fullLastImage: string = null;
  loading: Loading;
  capturedImage: string;
  capturedImages: string[] = [];

  hasPosted: boolean = false;
  base64Number: number = 0;
  downloadURLs = [];
  convertedPrice: string;

  isInfoFullFilled: boolean = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public platform: Platform,
    private gmapService: GmapService,
    private dbService: DbService,
    private appService: AppService,
    private authService: AuthService,
    private cameraService: CameraService) {
    this.dbService.getOneItemReturnPromise('UsersProfile/' + this.authService.uid).then((res) => {
      this.userProfile = res.val();
      console.log(this.userProfile);
      if (this.userProfile) {
        this.soldItem.AVATAR_URL = this.userProfile.AVATAR_URL;
        this.soldItem.NAME = this.userProfile.NAME;
        this.soldItem.PHONE = this.userProfile.TEL;
      } else {
        //   this.soldItem.AVATAR_URL = this.userProfile.AVATAR_URL;
        // this.soldItem.NAME = this.userProfile.NAME;
        // this.soldItem.PHONE = this.userProfile.TEL;
      }
    })
    this.soldItem.UID = this.authService.uid;
    this.soldItem.POSTDATE = this.appService.getCurrentDate();
    this.soldItem.PHOTOS[0] = 'https://firebasestorage.googleapis.com/v0/b/auth-38cb7.appspot.com/o/App_images%2Flogo.jpg?alt=media&token=a8411ee2-36a6-420d-bbd7-41f0d9daa003';
    this.tabChoice = 'info';
    this.selectInfo();
    this.base64Image = 'https://firebasestorage.googleapis.com/v0/b/auth-38cb7.appspot.com/o/App_images%2Flogo.jpg?alt=media&token=a8411ee2-36a6-420d-bbd7-41f0d9daa003';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewItemPage');
    // this.initMap();

  }

  onSubmit(form) {
    console.log(form.value);
    console.log(form.valid);
  }



  selectInfo() {
    if (this.dbService.getSoldItem()) {
      this.soldItem = this.dbService.getSoldItem();
    }
  }

  // PHOTO TAB
  selectPhoto() {
    this.base64Images = this.dbService.getUserCapturedBase64Images();
    if (this.base64Images.length > 0) {
      this.base64Image = this.base64Images[this.base64Images.length - 1];
    }
  }

  presentActionSheet() {
    // this.loadImage();
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Use Camera',
          handler: () => {
            // this.takePicture(Camera.PictureSourceType.CAMERA);
            this.takeBase64PicFromCamera();
          }
        },
        {
          text: 'Load from library',
          handler: () => {
            this.takeBase64PictureFromGallery();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }


  takeBase64PicFromCamera() {
    this.cameraService.takeBase64PictureFromCamera()
      .then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        // sync with dbService
        this.dbService.addUserCapturedBase64Image(this.base64Image);
        this.base64Images = this.dbService.getUserCapturedBase64Images();

      }, err => {
        alert(err);
      })
      .catch(err => alert(err))
  }

  takeBase64PictureFromGallery() {
    this.cameraService.takeBase64PictureFromGallery()
      .then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        // sync with dbService
        this.dbService.addUserCapturedBase64Image(this.base64Image);
        this.base64Images = this.dbService.getUserCapturedBase64Images();
      }, err => {
        alert(err);
      })
      .catch(err => alert(err))
  }

  onSelectImage(i: number) {
    this.base64Image = this.base64Images[i];
  }

  // LOCATION TAB
  initMap(initMap: any) {
    let isUserChosenPositionSet = this.dbService.isUserChosenPositionSet;
    var position;
    if (isUserChosenPositionSet) {
      position = this.dbService.getUserChosenPosition();
    } else {
      position = this.dbService.detectedUserPosition;

    }
    this.userChosenPosition = this.detectedUserPosition;
    let mapOptions = {
      center: new google.maps.LatLng(position.lat, position.lng),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById(initMap), mapOptions);

    this.userMarker = new google.maps.Marker({
      position: position,
      map: this.map
    });

    this.userMarker.addListener('click', () => {
      this.userMarker.setMap(null);
    })

    google.maps.event.addListener(this.map, 'click', (event) => {
      this.userMarker.setMap(null);
      let position = { lat: event.latLng.lat(), lng: event.latLng.lng() }
      console.log(position);
      this.userMarker = new google.maps.Marker({
        position: position,
        map: this.map
      })
      this.userChosenPosition = position;
      this.dbService.setUserChosenPosition(position);
      this.soldItem.POSITION = this.dbService.getUserChosenPosition();
    })
  }

  selectLocation() {
    console.log('selectLocation...');
    this.gmapService.getCurrentLocationReturnPromise()
      .then((pos: iPosition) => {
        console.log(pos);
        this.dbService.detectedUserPosition = pos;
        this.detectedUserPosition = this.dbService.detectedUserPosition;
        this.initMap('map');
      })
      .catch(err => {
        console.log(err);
      })

  }

  setChosenLocation() {
    this.dbService.isUserChosenPositionSet = true;
    this.isLocationSet = this.dbService.isUserChosenPositionSet;
    this.dbService.setUserChosenPosition(this.userChosenPosition);
  }

  // REVIEW TAB
  selectReview() {
    if (this.soldItem.PRICE) {
      this.convertedPrice = this.appService.convertToCurrency(this.soldItem.PRICE.toString(), ',');
    }
    this.userChosenPosition = this.dbService.getUserChosenPosition();
    setTimeout(() => {
      this.initMap('mapreview');
    }, 1000)
  }

  onLocate() {
    console.log('onLocate');
    this.isLocationSet = true
    this.initMap('map');
  }

  onOpenMap() {
    console.log('onOpenMap');
  }

  onMapClick(e) {
    console.log(e);
  }

  checkInfoFullFilled() {
    if (this.soldItem.NAME == null || this.soldItem.NAME =='') {
      this.isInfoFullFilled = false;
    }
    if (this.soldItem.PHONE == null || this.soldItem.PHONE =='') {
      this.isInfoFullFilled = false;
    }
    if (this.soldItem.PRICE == null || this.soldItem.PRICE.toString()=='') {
      this.isInfoFullFilled = false;
    }
    if (this.soldItem.USEDSQUARES == null || this.soldItem.PRICE.toString()=='') {
      this.isInfoFullFilled = false;
    }
    if (this.soldItem.GROUNDSQUARES == null || this.soldItem.PRICE.toString()=='' ) {
      this.isInfoFullFilled = false;
    }
    if (this.soldItem.ADDRESS == null || this.soldItem.ADDRESS =='') {
      this.isInfoFullFilled = false;
    }
    console.log(this.soldItem.PRICE);
    console.log(this.soldItem.USEDSQUARES);
    console.log(this.soldItem.GROUNDSQUARES);
    console.log(this.soldItem.ADDRESS);

    console.log(this.isInfoFullFilled, '<--isInfoFullfilled');
  }


  post() {
    this.checkInfoFullFilled();
    // console.log(this.isInfoFullFilled, '<--isInfoFullfilled');
    if (this.isInfoFullFilled) {
      if (this.authService.uid) {
        this.soldItem.UID = this.authService.uid;
        var itemKey: string = '';
        this.hasPosted = true;
        // upload images to firebase storage, then return an array of links of images

        this.dbService.uploadBase64Images2FirebaseReturnPromise(this.base64Images)
          .then((data) => {
            let downloadURls = data;

            // FOR: to avoid error when SoldItem not have image. Add logo as one pic default
            if (downloadURls.length < 1) {
              console.log('downloadUrls.length = 0');
              downloadURls = ['https://firebasestorage.googleapis.com/v0/b/auth-38cb7.appspot.com/o/App_images%2Flogo.png?alt=media&token=c1d12642-a7f8-4d7a-94e2-f37b4da66b76']
            }
            this.soldItem.POSITION = this.dbService.getUserChosenPosition();
            this.soldItem.PHOTOS = downloadURls;
            this.dbService.setSoldITem(this.soldItem);
            this.dbService.insertOneNewItemReturnPromise(this.soldItem, 'soldItems')
              .then((res) => {
                itemKey = res.key;
                // console.log(res.val());
                this.appService.alertMsg('Done', 'Successfully. Your post will be approved shortly');
                this.navCtrl.push(HomePage)
              })
              .then(() => {
                let item = {
                  key: itemKey,
                  date: this.appService.getCurrentDate()
                };
                this.dbService.insertOneNewItemWithSetReturnPromise(item, 'UserSoldItems/' + this.authService.uid + '/' + itemKey)
                  .then((res) => {
                    console.log(res, 'update successfully');
                  })
                  .catch(err => console.log(err))
              })
              .catch((err) => {
                this.appService.alertMsg('Error', 'Try again later!.ErrorCode: ' + err);
                this.hasPosted = false;
              })
          }, err => {
            alert(err);
            this.hasPosted = false;
          })
          .catch(err => {
            alert(err);
            this.hasPosted = false;
          })
      } else {
        this.alertMsgWithConfirmationToGoToPage();
      }
    } else {
      this.alertMsgConfirmation('Missing:','Please fill all required info');
    }

  }

  onKeyUp() {
    console.log(this.soldItem.PRICE);
    if (this.soldItem.PRICE) {
      this.convertedPrice = this.appService.convertToCurrency(this.soldItem.PRICE.toString(), ',');
    }
  }

  alertMsgWithConfirmationToGoToPage() {
    this.alertCtrl.create({
      title: 'Not Signed',
      message: 'Plz login to continue',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {

          }
        },
        {
          text: 'OK',
          handler: () => {
            console.log('go to LoginPage ');
            // this.navCtrl.popToRoot();
            this.navCtrl.push(LoginPage);
          }
        }
      ]
    }).present();
  }

  alertMsgConfirmation(title: string, msg: string){
        this.alertCtrl.create({
            title: title,
            message: msg,
            buttons: [
                {
                    text: 'OK',
                    handler: ()=>{
                        setTimeout(()=>{
                          this.tabChoice = 'info';
                        },500);
                    }
                }
            ]
        }).present()
    }


}

// interface iPosition {
//     lat: number,
//     lng: number
// }
