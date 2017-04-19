import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DbService } from '../../services/db.service';

/*
  Generated class for the Promise page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-promise',
  templateUrl: 'promise.html'
})
export class PromisePage {

  constructor(
    private dbService: DbService,
    public navCtrl: NavController, 
    public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromisePage');
    // this.promise1();
    // this.promiseType2();
    this.getDataFromURL('GET', 'https://jsonplaceholder.typicode.com/photos')
    .then((data)=>{
      console.log('start getting data');
      console.log(data);
      console.log('getting data done..')
    })
    .catch(err=>console.log(err));
  }

  promise1() {
    let p1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Promise 1 called');
      }, 10000);
      console.log('test1');
      resolve('promise1');
    })
    let p2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Promise 2 called');
      }, 2000);
      console.log('test2');
      resolve('promise2');
    })

    p1.then((res) => {
      console.log(res);
      p2
    }).then((res) => {
      console.log(res);
    })
  }

  promiseType2() {
    let cleanRoom = () => {
      return new Promise((resolve, reject) => {
        // let done = false;
        var done: boolean = false;
        setTimeout(() => {
          console.log('cleaned the room');
          done = true;
          if (done) {
            resolve('clean the room');
          }
        }, 3000)

      })
    }

    let removeGarbage = () => {
      return new Promise((resolve, reject) => {
        var done: boolean = false;
        setTimeout(() => {
          console.log('removeGarbage');
          done = true;
          if (done) {
            resolve('removeGarbage');
          }
        }, 7000)
      })
    }

    let winIceCream = () => {
      return new Promise((resolve, reject) => {
        var done: boolean = false;
        setTimeout(() => {
          console.log('winIceCream');
          done = true;
          if (done) {
            resolve('winIceCream');
          }
        }, 3000)
      })
    }

    let sleep = new Promise((resolve, reject)=>{
      
      setTimeout(()=> {
       console.log('sleeping ....') 
      }, 2000);
      resolve('sleep');
      reject('sleep err');
    })

    cleanRoom().then((res) => {
      console.log(res);
      return removeGarbage();
    }).then((res) => {
      console.log(res);
      return winIceCream();
    }).then((res) => {
      console.log(res);
      console.log('all done!')
      return sleep;
    }).then(res=>{
      console.log(res);
    })
  }

  getDataFromURL(method, url){
    return new Promise((resolve, reject)=>{
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = ()=>{
        if(xhr.status >=200 && xhr.status <300){
          // resolve(xhr.response);
          let array = ['a','b'];
          array.push('c');
          resolve(array);
        }else{
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          })
        }
      }

      xhr.onerror = () =>{
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        })
      }

      xhr.send();
    })
  }

  // TEST ONLY
  upload(){
    let imageData = '../../assets/images/a.jpg';
    this.dbService.uploadImage2Firebase(imageData)
  }

}
