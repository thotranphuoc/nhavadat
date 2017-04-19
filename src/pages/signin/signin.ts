import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app.service';

import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {
  isSigned: boolean = false;
  action: string = 'signIn';
  btnSignIn: boolean = true;
  btnSignUp: boolean = true;
  btnReset: boolean = true;
  signIn: { email: string, password: string } = { email: '', password: '' };
  signUp: { email: string, password1: string, password2: string } = { email: '', password1: '', password2: '' };
  resetAccount: { email: string } = { email: '' };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private appService: AppService) {
    this.isSigned = this.authService.isSigned;
    this.action = this.navParams.get('action');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }

  onSignIn(form) {
    // console.log(form.value);
    // console.log(this.account);
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

        this.navCtrl.push(HomePage);
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

  onSignUp(form) {
    this.btnSignUp = false;
    console.log(form.value);
    if (this.signUp.password1 === this.signUp.password2) {
      this.authService.signUp(this.signUp.email, this.signUp.password1)
        .then((data) => {
          console.log(data);
          this.authService.isSigned = true;
          this.isSigned = this.authService.isSigned;
          this.appService.alertMsg('Success', data.email + ' created successfully!');
          this.navCtrl.push(HomePage);
        })
        .catch(err => {
          console.log(err);
          this.appService.alertMsg('Error', err.message);
          this.btnSignUp = true;
          this.authService.isSigned = false;
          this.isSigned = this.authService.isSigned;
        })
    } else {
      console.log('password not matched');
      this.appService.alertMsg('Error', 'password not matched');
    }
  }

  onResetAccount(form) {
    this.btnReset = false;
    console.log(form.value)
    this.authService.resetAccount(this.resetAccount.email).then((data) => {
      this.btnReset = true;
      this.authService.isSigned = false;
      this.isSigned = this.authService.isSigned;
      this.appService.alertMsg('Success', 'Please check email and reset your account: ' + this.resetAccount.email);
      this.navCtrl.push(HomePage);
    })
  }

  // onSignOut(){
  //   this.authService.signOut().then((data)=>{
  //     console.log('user signed out');
  //     this.appService.alertMsg('Alert', 'User just signed out');
  //     this.navCtrl.push(HomePage);
  //     this.authService.isSigned = false;
  //     this.isSigned = this.authService.isSigned;
  //   })
  // }

}
