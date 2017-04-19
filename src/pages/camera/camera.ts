import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Camera } from 'ionic-native';
import * as firebase from 'firebase';

import { DbService } from '../../services/db.service';

/*
  Generated class for the Camera page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html'
})
export class CameraPage {
  public base64Image: string = null;
  base64Images: string[] = [];
  downloadUrls: string[] = [];
  public imageData: string;
  isbase64PicReady: boolean = false;
  MESSAGE_TO_DISPLAY:string = '';
  downloadUrl: string = '';
  constructor(
    private dbService: DbService,
    public navCtrl: NavController, 
    private alertCtrl: AlertController) {

  }

  takePicture() {
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 500,
      quality: 100,
      allowEdit: true,
      correctOrientation: false,
      saveToPhotoAlbum: true,
      // mediaType: 0
    }).then((imageData) => {
      // this.imageData = imageData;
      // this.alertMessage('imageData', imageData);
      // this.base64Image = 'data:image/jpeg;base64,' + imageData;
      // this.alertMessage('base64Image', this.base64Image);
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.base64Images.push(this.base64Image);
      let cameraImageSelector = document.getElementById('camera-image-capture');
      cameraImageSelector.setAttribute('src', this.base64Image);
      // this.alertMessage('image', this.base64Image);
      this.isbase64PicReady = true;

    }, (err) => {
      console.log(err);
      this.alertMessage('err', err);
      this.isbase64PicReady = false;
    });
  }

  takePictureFromGallery() {
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100,
      allowEdit: true,
      correctOrientation: false,
      saveToPhotoAlbum: true,
      mediaType: 0,
      sourceType: 0  // default camera =1
    }).then((imageData) => {
      // this.imageData = imageData;
      // this.alertMessage('imageData', imageData);
      // this.base64Image = 'data:image/jpeg;base64,' + imageData;
      // this.alertMessage('base64Image', this.base64Image);
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.base64Images.push(this.base64Image);
      let cameraImageSelector = document.getElementById('camera-image-capture');
      cameraImageSelector.setAttribute('src', this.base64Image);
      // this.alertMessage('base64Image', this.base64Image);
      this.isbase64PicReady = true;
    }, (err) => {
      console.log(err);
      this.alertMessage('err', err);
      this.isbase64PicReady = false;
    });
  }

  alertMessage(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log('OK');
          }
        }
      ]
    })

    alert.present();
  }

  upload2Firebase2() {
    let imageName: string = 'IMG-' + new Date().getTime() + '.jpg';
    let storageRef = firebase.storage().ref('images/' + imageName);
    this.isbase64PicReady = false;
    let base64Message = this.base64Image;
    let btnUpload = document.getElementById('btnUpload');
    btnUpload.setAttribute("style", "background-color: grey;")

    let uploadTask = storageRef.putString(base64Message, 'data_url', { contentType: 'image/png' });
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.MESSAGE_TO_DISPLAY = 'Upload is ' + progress + '% done';
      console.log(this.MESSAGE_TO_DISPLAY);
      // switch (snapshot.state) {
      //   case firebase.storage.TaskState.PAUSED: // or 'paused'
      //     this.MESSAGE_TO_DISPLAY ='Upload is paused'
      //     console.log(this.MESSAGE_TO_DISPLAY);
      //     break;
      //   case firebase.storage.TaskState.RUNNING: // or 'running'
      //     this.MESSAGE_TO_DISPLAY ='Upload is running'
      //     console.log(this.MESSAGE_TO_DISPLAY);
      //     break;
      //   case firebase.storage.TaskState.SUCCESS: // or 'running'
      //     this.MESSAGE_TO_DISPLAY ='Upload is done'
      //     console.log(this.MESSAGE_TO_DISPLAY);
      //     break;
      // }
    }, (err) => {
      // on error
    }, () => {
      // upload completed
       this.downloadUrl = uploadTask.snapshot.downloadURL;
    });
    // .then((snapshot)=>{
    //   console.log('base64 string uploaded!');
    //   btnUpload.setAttribute("style", "background-color: green;")
    //   alert('base64 string uploaded!');
    //   console.log(snapshot);
    // })
    // .catch((err)=>{
    //   btnUpload.setAttribute("style", "background-color: red;")
    //   alert(err);
    // })
  }

  upload2Firebase(){
    this.dbService.uploadBase64Image2Firebase(this.base64Image).then((data: {downloadUrl: string, name: string})=>{
      alert(data);
      this.alertMessage('dlURL', data.downloadUrl);
      this.alertMessage('name', data.name);
      
    })
  }
  uploadImages2Firebase(){
    this.dbService.uploadBase64Images2FirebaseReturnPromise(this.base64Images)
    .then((data)=>{
      this.downloadUrls = data;
      console.log(data);
    })
    .catch(err=>{
      console.log(err)
    })
  }


  loadPhotos() {
    let cameraImageSelector = document.getElementById('camera-image');
    var storageRef = firebase.storage().ref('images/IMG-1489923381206.jpg');
    storageRef.getDownloadURL().then((url) => {
      cameraImageSelector.setAttribute('src', url);
      alert(url);
    })
      .catch(err => alert(err))
  }



}
