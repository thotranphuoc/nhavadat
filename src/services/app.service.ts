import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController, NavController } from 'ionic-angular';

import { iSetting } from '../interface/setting.interface';

@Injectable()
export class AppService {
    SETTINGS: iSetting = {
        setHouse: true,
        setApartment: true,
        setLand: true,
        setOther: true,
        language: 'English'
    }
    loadCtrl: any;

    constructor(
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController) { }

    alertError(title: string, msg: string) {
        this.alertCtrl.create({
            title: title,
            message: msg,
            buttons: ['OK']
        }).present();
    }
    alertMsg(title: string, msg: string) {
        this.alertCtrl.create({
            title: title,
            message: msg,
            buttons: ['OK']
        }).present();
    }

    



    toastMsg(msg: string, duration: number) {
        const toast = this.toastCtrl.create({
            message: msg,
            duration: duration
        });
        toast.present();
    }

    convertToCurrency(number: string, seperatedSymbol: string): string {
        let parts = [];
        let len = number.length / 3;
        // console.log(len);
        for (let i = 0; i < len; i++) {
            let fromNum = number.length - (3 + i * 3);
            if (fromNum > 0) {
                parts[i] = number.substr(fromNum, 3);
                // console.log(parts[i]);
            } else {
                parts[i] = number.substr(0, number.length - i * 3);
                // console.log(parts[i]);
            }
        }
        // console.log(parts);
        var convertN = '';
        var finalConvertedN = '';
        for (let i = 1; i <= parts.length; i++) {
            convertN = convertN.concat(parts[parts.length - i], seperatedSymbol);

        }
        finalConvertedN = convertN.substr(0, convertN.length - 1);
        // console.log(finalConvertedN);
        return finalConvertedN;
    }

    getSetting() {
        return this.SETTINGS;
    }

    updateSetting(settings: iSetting) {
        this.SETTINGS = settings;
    }

    startLoadingCtrl() {
        this.loadCtrl = this.loadingCtrl.create({
            duration: 3000
        }).present();
    }

    // return format: '2017/04/09'
    getCurrentDate(): string {
        let today = new Date();
        return today.getUTCFullYear().toString() + '/' + (today.getMonth() + 1).toString() + '/' + today.getDate().toString();
    }

    // return format: '12:30:15'
    getCurrentTime(): string {
        let today = new Date();
        return today.getHours().toString() + ':' + today.getMinutes().toString() + ':' + today.getSeconds().toString();
    }

    getCurrentDataAndTime(): string {
        return this.getCurrentDate() + ' ' + this.getCurrentTime();
    }

    // stopLoadingCtrl(){
    //     this.loadCtrl.dismiss();
    // }

    convertCodeToDetail(code: string): string {
        switch (code) {
            case 'setHouse':
                return 'Nhà riêng lẻ';
            case 'setApartment':
                return 'Chưng cư, CHCC';
            case 'setLand':
                return 'Đất vườn';
            case 'setOther':
                return 'Khác';
            default:
                return 'Khác';
        };
    }

    // alertMsgWithConfirmationToGoToPage(page) {
    //     return this.alertCtrl.create({
    //         title: 'Not Signed',
    //         message: 'Plz login to continue',
    //         buttons: [
    //             {
    //                 text: 'Cancel',
    //                 handler: () => {

    //                 }
    //             },
    //             {
    //                 text: 'OK',
    //                 handler: () => {
    //                     console.log('go to page: ', page);
    //                     // this.navCtrl.popToRoot();
    //                     this.navCtrl.push(page);
    //                 }
    //             }
    //         ]
    //     })
    // }
}