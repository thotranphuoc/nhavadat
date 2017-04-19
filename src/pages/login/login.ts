import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  signIn: { email: string, password: string } = { email: null, password: null };
  btnSignIn: boolean = true;
  isSigned: boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService: AuthService,
    private appService: AppService) {

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onSignIn(form) {
    this.btnSignIn = false;
    this.authService.signIn(this.signIn.email, this.signIn.password)
      .then((data) => {

        // update signed status
        this.authService.isSigned = true;
        this.isSigned = this.authService.isSigned;

        // get UID
        this.authService.uid = data.uid;
        this.authService.email = data.email;
        console.log(data);
        console.log(this.authService.uid);
        console.log(this.authService.email)

        this.navCtrl.pop();
      })
      .catch(err => {
        console.log(err);
        this.authService.isSigned = false;
        this.isSigned = this.authService.isSigned;
        this.appService.alertMsg('Error', err.message);
        this.btnSignIn = true;
      })
    // reset form
    this.signIn = { email: null, password: null };
  }

}
