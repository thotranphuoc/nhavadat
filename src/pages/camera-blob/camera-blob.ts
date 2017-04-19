import { Component, NgZone, Input, ChangeDetectionStrategy } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Camera, Device } from 'ionic-native';

import * as firebase from 'firebase';
declare var window: any;
@Component({
  selector: 'page-camera-blob',
  templateUrl: 'camera-blob.html'
})
export class CameraBlobPage {
  assetCollection: any;
  userAuth: any;

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              private platform: Platform,
              private http: Http,
              private zone: NgZone) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraBlobPage');
    firebase.auth().signInWithEmailAndPassword('newuser@gmail.com', 'password')
      .then((_auth)=>{
        // when autheticated .. alert the user
        console.log('login success');
        this.userAuth = _auth;
        this.zone.run(()=>{
          this.loadData();
        });
      })
      .catch((err:Error)=>{
        // hanle error here
        var errMessage = err.message;
        alert(errMessage);
      });

  }
  // call after user login successfully
  loadData(){
    var result = [];
    //loadData from firebase
    firebase.database().ref('assets').orderByKey().once('value', (_snapshot: any)=>{
      _snapshot.forEach((_childSnap)=>{
        // get the key/id and the data for display
        var element = _childSnap.val();
        element.id = _childSnap.key;
        result.push(element);
      });
      this.assetCollection = result;
    });
  }

  makeFileIntoBlob(_imagePath){
    // INSTALL PLUGIN: cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject)=>{
      window.resolveLocalFileSystemURL(_imagePath, (fileEntry)=>{
        fileEntry.file((resFile)=>{
          var reader = new FileReader();
          reader.onloadend = (evt: any)=>{
            var imgBlob: any = new Blob([evt.target.result],{type: 'image/jpeg'});
            imgBlob.name = 'sample.jpg';
            resolve(imgBlob);
          };

          reader.onerror = (e)=>{
            console.log('Fail file read: ' + e.toString());
            reject(e);
          }

          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }

  uploadToFirebase(_imageBlob){
    var fileName = 'sample-'+ new Date().getTime() + '.jpg';
    return new Promise((resolve, reject)=>{
      var fileRef = firebase.storage().ref('images/'+ fileName);
      var uploadTask = fileRef.put(_imageBlob);
      uploadTask.on('state_changed', (_snapshot)=>{
        console.log('_snapshot progress: '+ _snapshot);
      }, (err)=>{
        reject(err);
      });
    });
  }

  saveToDatabaseAssetList(_uploadSnapshot){
    var ref = firebase.database().ref('asset');
    return new Promise((resolve, reject)=>{
      // we will save meta data of image in database
      var dataToSave = {
        'URL': _uploadSnapshot.downloadURL,
        'name': _uploadSnapshot.matadata.name,
        'owner': firebase.auth().currentUser.uid,
        'email': firebase.auth().currentUser.email,
        'lastUpdated': new Date().getTime()
      };
      ref.push(dataToSave, (_response)=>{
        resolve(_response);
      }).catch((err)=>{
        reject(err);
      });
    });
  }

  doGetPicture(){
    //TODO: 
    // get picture from camera
    console.log(Device);
    let imageSource = (Device.isVirtual? Camera.PictureSourceType.PHOTOLIBRARY: Camera.PictureSourceType.CAMERA);

    Camera.getPicture({
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: imageSource,
      targetHeight: 640,
      correctOrientation: true
    }).then((_imagePath)=>{
      alert('got image path:' + _imagePath);
      //convert to blob;
      return this.makeFileIntoBlob(_imagePath);
    }).then((_imageBlob)=>{
      alert('got image blob '+ _imageBlob);
      // upload the blob
      return this.uploadToFirebase(_imageBlob);
    }).then((_uploadSnapshot: any)=>{
      alert('file uploaded successfully '+ _uploadSnapshot.downloadURL);
      //store reference to storage in database
      return this.saveToDatabaseAssetList(_uploadSnapshot);
    }).then((_uploadSnapshot)=>{
      alert('file save to asset catalog successfully ');
    },(err)=>{
      alert('Error: '+ (err.message || err));
    });
  }

  trackByFunction(index, item) {
    return item.id
  }
}

@Component({
  selector: 'item-component',
  template:`
      <p>{{i}} - {{item.name}}</p>
      <p>{{item.lastUpdated}}</p>
      <img [src]=item.URL width="180px" class="padding"/>  
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent {
  @Input() item: any;
  constructor(){}
}
