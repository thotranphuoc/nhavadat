import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ActionSheetController } from 'ionic-angular';

import { DbService } from '../../services/db.service';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app.service';
@Component({
  selector: 'page-sold-items-view',
  templateUrl: 'sold-items-view.html'
})
export class SoldItemsViewPage {
  loading: any;
  soldItems: any[] = [];
  soldItemsDetail: any[] = [];
  IS_DETAILED: boolean[] = [];
  IS_REMOVED: boolean[] = [];

  NUM_OF_LOVES: number[] = [];
  isNUM_OF_LOVE: boolean = false;
  NUM_OF_COMMENTS: number[] = [];
  isNUM_OF_COMMENTS: boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private dbService: DbService,
    private authService: AuthService,
    private appService: AppService) {
      
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
        spinner: 'crescent'
      })
      this.loading.present();
      this.dbService.getItemsFromFBReturnPromise('UserSoldItems/'+this.authService.uid)
        .then((snapshot)=>{
          snapshot.forEach(snapChild => {
            let item = {
              key: snapChild.val().key,
              date: snapChild.val().date
            };
            this.soldItems.push(item);
          });
          console.log(this.soldItems);
          this.soldItems.forEach(soldItem=>{
            this.dbService.getOneItemReturnPromise('soldItems/'+soldItem.key)
            .then((res)=>{
              let data = res.val();
              console.log(data);
              data['new_PRICE'] = this.appService.convertToCurrency(data.PRICE.toString(), ','); // convert PRICE
              data['new_KIND'] = this.appService.convertCodeToDetail(data.KIND); // convert KIND
              
              this.soldItemsDetail.push({key: soldItem.key, data: data});
              this.IS_DETAILED.push(false);
              this.IS_REMOVED.push(false);
              
            })
          });
          this.soldItems.forEach(soldItem=>{
            this.getNumberFeedbackOfItemFromUsers(soldItem.key);
            this.getNumberLoveOfItemFromUsers(soldItem.key);
          });
          console.log(this.soldItemsDetail);
          console.log(this.NUM_OF_COMMENTS);
          console.log(this.NUM_OF_LOVES);
          this.hideLoading();
        })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SoldItemsViewPage');
  }

  private hideLoading(){
    this.loading.dismiss();
  }

  showLess(index: number){
    this.IS_DETAILED[index] = false;
    console.log('Show Less...', index);
  }

  showMore(index: number){
    this.IS_DETAILED[index] = true;
    console.log('Show More...', index);
  }


  onDeleteFromFavorite(key: string,index: number){
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          handler: ()=>{
            this.deleteFromFavorite(key, index);
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

  deleteFromFavorite(key: string, index: number){
    this.dbService.removeOneItemFromDBReturnPromise(key,'UserSoldItems/'+this.authService.uid)
    .then((res)=>{
      this.IS_REMOVED[index]=true;
      console.log('item removed from UserSoldItems ', res);
    })
    .catch(err=>{
      console.log('Error:', err)
    })

    this.dbService.removeOneItemFromDBReturnPromise(key,'soldItems')
    .then((res)=>{
      // this.IS_REMOVED[index]=true;
      console.log('item removed from soldItems ', res);
    })
    .catch(err=>{
      console.log('Error:', err)
    })
  }

  getNumberLoveOfItemFromUsers(key){
    this.dbService.getLengthOfDB('FavoriteOfItemFromUsers/'+key)
      .then((res: number)=>{
        this.NUM_OF_LOVES.push(res);
      })
  }

  getNumberFeedbackOfItemFromUsers(key) {
    this.dbService.getLengthOfDB('FeedbackOfItemFromUsers/'+key )
      .then((res: number) => {
        this.NUM_OF_COMMENTS.push(res);
      })
  }

}
