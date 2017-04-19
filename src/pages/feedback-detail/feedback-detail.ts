import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { iFeedback } from '../../interface/feedback.interface';
import { iProfile } from '../../interface/profile.interface';
import { DbService } from '../../services/db.service';
@Component({
  selector: 'page-feedback-detail',
  templateUrl: 'feedback-detail.html'
})
export class FeedbackDetailPage {
  hasUserAvatar: boolean = false;
  feedbackKey: { key: string, data: iFeedback };
  feedback: iFeedback = {
    SOLDOUT: false,
    WRONGPIC: false,
    WRONGPHONE: false,
    WRONGLOCATION: false,
    WRONGPRICE: false,
    POSTTIME: null,
    COMMNENTS: null,
    NAME: null
  };
  profile: iProfile;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dbService: DbService) {
    console.log('constructor');
    this.feedbackKey = this.navParams.data;
    console.log(this.feedbackKey);
    this.feedback = this.feedbackKey.data;
    this.dbService.getOneItemReturnPromise('UsersProfile/' + this.feedbackKey.key)
      .then((data) => {
        console.log(data.val());
        this.profile = data.val();
        this.hasUserAvatar = true;
      })
      .catch(err => {
        console.log(err)
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackDetailPage');
  }

  ionViewWillEnter() {
    // get Avatar
    console.log('viewWillENter');

  }

}
