import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// import { CallNumber } from '@ionic-native/call-number';

import { AppService } from '../../services/app.service';
import { iSoldItem } from '../../interface/sold-item.interface';
import { DbService } from '../../services/db.service';
import { AuthService } from '../../services/auth.service';
import { FeedbackPage } from '../../pages/feedback/feedback';
import { FeedbackDetailPage } from '../../pages/feedback-detail/feedback-detail';

import { iFeedback } from '../../interface/feedback.interface';

@Component({
  selector: 'page-show-item-detail',
  templateUrl: 'show-item-detail.html'
})
export class ShowItemDetailPage {
  objKey: any;
  obj: any = null;
  formattedCurrency: string;
  photos: string[];
  kind: any;
  key: string;
  feedbacks: any[] = [];
  NUM_OF_LOVE: number = 0;
  isNUM_OF_LOVE: boolean = false;
  NUM_OF_COMMENTS: number = 0;
  isNUM_OF_COMMENTS: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appService: AppService,
    private dbService: DbService,
    private authService: AuthService,
    // private callNumber: CallNumber,
    ) {
    this.objKey = this.navParams.data;
    console.log(this.objKey);
    this.obj = this.objKey.data;
    this.key = this.objKey.key;

    // FEEDBACK of item from USERS
    this.getFeedbackOfItemFromUsers();
    this.getNumberLoveOfItemFromUsers();
    this.getNumberFeedbackOfItemFromUsers();
    // this.formattedCurrency = this.appService.convertToCurrency(this.obj.PRICE.toString(), ',');
    this.obj['new_PRICE'] = this.appService.convertToCurrency(this.obj.PRICE.toString(), ',');
    console.log(this.obj);
    this.photos = this.obj.PHOTOS;
    // this.kind = this.appService.convertCodeToDetail(this.obj.KIND);
    this.obj['new_KIND']= this.appService.convertCodeToDetail(this.obj.KIND);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowItemDetailPage');
  }

  ionViewWillEnter() {

  }

  // 1. add to Favorite of User for Many Items
  // 2. add to Fovorite of Item from many Users
  onAddFovarite() {
    if (this.authService.isSigned) {
      // 1. update FavoriteOfUserForItems
      let favorite1 = {
        item: this.key,
        date: this.appService.getCurrentDataAndTime()
      }
      this.dbService.insertOneNewItemReturnPromise(favorite1, 'FavoriteOfUserForItems/' + this.authService.uid)
        .then((data) => {
          console.log('Your favorite just added', data);
          this.appService.toastMsg('Your favorite just added', 3000);
        })
        .catch(err => {
          console.log(err);
          this.appService.alertError('Error', 'err');
        })

      // 2. update FavoriteOfItemFromUsers
      let favorite2 = {
        user: this.authService.uid,
        date: this.appService.getCurrentDataAndTime()
      };

      this.dbService.insertOneNewItemReturnPromise(favorite2, 'FavoriteOfItemFromUsers/' + this.key)
        .then((data) => {
          console.log('user just add to item favorites', data);
        })
        .catch(err => {
          console.log('Error', err);
        })
    } else {
      this.appService.alertMsg('Not signed', 'Please sign in to add favorite');
    }
  }



  onFeedBack() {
    this.navCtrl.push(FeedbackPage, this.key);
  }

  viewFeedbackInDetail(feedback: iFeedback) {
    this.navCtrl.push(FeedbackDetailPage, feedback);
  }

  getFeedbackOfItemFromUsers() {
    this.dbService.getItemsFromFBReturnPromise('FeedbackOfItemFromUsers/' + this.key)
      .then((snapShot) => {
        snapShot.forEach(_childSnap => {
          let key = _childSnap.key;
          let data = _childSnap.val();
          let item = {
            key: key,
            data: data
          }
          console.log(item);
          this.feedbacks.push(item);
          return false;
        });
        console.log('feedbacks: ', this.feedbacks);

      })
      .catch(err => {
        console.log(err);
      })
  }

  getNumberLoveOfItemFromUsers(){
    this.dbService.getLengthOfDB('FavoriteOfItemFromUsers/'+ this.key)
      .then((res: number)=>{
        this.NUM_OF_LOVE = res;
      })
  }

  getNumberFeedbackOfItemFromUsers() {
    this.dbService.getLengthOfDB('FeedbackOfItemFromUsers/' + this.key)
      .then((res: number) => {
        this.NUM_OF_COMMENTS = res;
      })
  }

  makeCall(){
    //TODO: make fone call
    console.log('TODO: make fone call');
    // this.callNumber.callNumber('+84937811633', true)
    // .then((res)=>{
    //   console.log('Call Success to', res);
    // })
    // .catch((err)=>{
    //   console.log('Fail');
    // })
  }

}
