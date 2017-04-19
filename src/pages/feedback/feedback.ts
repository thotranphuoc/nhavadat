import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { DbService } from '../../services/db.service';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app.service';
import { iFeedback } from '../../interface/feedback.interface';
import { SigninPage } from '../../pages/signin/signin';
import { LoginPage } from '../../pages/login/login';
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {
  feedback: iFeedback;
  ITEM_KEY: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private dbService: DbService,
    private authService: AuthService,
    private appService: AppService) {
    this.feedback = this.dbService.getFeedback();
    // this.ITEM_KEY = this.navParams.data;
    // this.USER_ID = this.authService.uid;
    // this.feedback.NAME = this.authService.email;
    // this.feedback.POSTTIME = this.appService.getCurrentDate();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');

  }

  sendFeedback(form) {
    // TODO: update feedback to cloud. If not signed, route to LoginPage. If signed, continue to update to fb
    this.ITEM_KEY = this.navParams.data;
    this.feedback.NAME = this.authService.email;
    this.feedback.POSTTIME = this.appService.getCurrentDataAndTime();
    this.dbService.setFeedback(this.feedback);
    if (this.authService.isSigned) {
      // 1. Update FeedbackOfItemFromUsers table
      this.dbService.insertOneNewItemWithSetReturnPromise(this.feedback, 'FeedbackOfItemFromUsers/' + this.ITEM_KEY + '/' + this.authService.uid)
        .then((data) => {
          console.log('feedback updated successfully');
          this.navCtrl.popToRoot();
          this.resetForm();
        })
        .catch(err => {
          console.log(err);
        })

      // 2. Update FeedbackOfUserForItems
      this.dbService.insertOneNewItemWithSetReturnPromise(this.feedback, 'FeedbackOfUserForItems/' + this.authService.uid + '/' + this.ITEM_KEY)
        .then((data) => {
          console.log('feedback updated to user successfully')
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      this.alertMsgWithConfirmation();
    }

  }

  alertMsgWithConfirmation() {
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
            console.log('go2SignIn Page');
            // this.navCtrl.popToRoot();
            this.navCtrl.push(LoginPage);
          }
        }
      ]
    }).present();
  }

  resetForm() {
    this.feedback = {
      SOLDOUT: false,
      WRONGPIC: false,
      WRONGPHONE: false,
      WRONGLOCATION: false,
      WRONGPRICE: false,
      POSTTIME: null,
      COMMNENTS: null,
      NAME: null
    }

    this.dbService.setFeedback(this.feedback);
  }

}


