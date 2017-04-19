import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';
import { DbService } from '../../services/db.service';
import { CameraService } from '../../services/camera.service';
import { iProfile } from '../../interface/profile.interface';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  profile: iProfile = {
    AVATAR_URL: '',
    NAME: '',
    EMAIL: '',
    BIRTHDAY: '',
    TEL: '',
    ADDRESS: '',
    FAVORITES: ['']
  }
  userID: string = null;
  userEmail: string = null;
  base64Image: string = null;
  hasNewAvatar: boolean = false;
  btnEnable: boolean = true;
  constructor(
    private authService: AuthService,
    private dbService: DbService,
    private cameraService: CameraService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController, ) {
    this.userID = this.authService.uid;
    this.userEmail = this.authService.email;
    this.profile.EMAIL = this.authService.email;
    this.getProfile();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  onUpdateProfile(form) {
    this.btnEnable = false;
    // 1. upload image to storage, return url. setTo profile.AVATAR_URL
    this.dbService.uploadBase64Image2FirebaseReturnPromise('Avatar/' + this.userID, this.base64Image)
      .then((res) => {
        this.profile.AVATAR_URL = res.downloadURL;
        // 2. insert or update profile database;
        this.dbService.insertOneNewItemWithSetReturnPromise(this.profile, 'UsersProfile/' + this.userID).then((res) => {
          console.log(res);
          console.log('insert successfully...');
          this.btnEnable = true;
        }).catch(err => {
          console.log(err);
          this.btnEnable = true;
        })
      })
      .catch(err => {
        console.log(err);
        this.btnEnable = true;
      })
    // // console.log(form.value);
    // console.log(this.profile);



  }

  getProfile() {
    this.dbService.getOneItemReturnPromise('UsersProfile/' + this.userID)
      .then((data) => {
        console.log(data.val());
        let item = data.val();
        this.profile = {
          AVATAR_URL: item.AVATAR_URL,
          NAME: item.NAME,
          EMAIL: item.EMAIL,
          BIRTHDAY: item.BIRTHDAY,
          TEL: item.TEL,
          ADDRESS: item.ADDRESS,
          FAVORITES: item.FAVORITES
        };

      })
      .catch(err => {
        console.log(err);
      })
  }

  takeAvatarPic() {
    this.presentActionSheet();
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
        this.hasNewAvatar = true;
        // sync with authService
        // this.dbService.addUserCapturedBase64Image(this.base64Image);
        // this.base64Images = this.dbService.getUserCapturedBase64Images();

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
        // this.dbService.addUserCapturedBase64Image(this.base64Image);
        // this.base64Images = this.dbService.getUserCapturedBase64Images();
      }, err => {
        alert(err);
      })
      .catch(err => alert(err))
  }

}
