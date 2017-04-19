import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { DbService } from '../../services/db.service';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app.service';
import { iSoldItem } from '../../interface/sold-item.interface';

import { ShowItemDetailPage } from '../../pages/show-item-detail/show-item-detail';
@Component({
  selector: 'page-favorite-view',
  templateUrl: 'favorite-view.html'
})
export class FavoriteViewPage {
  favorites: any[] = [];
  favDetails: any[] = [];
  IS_DETAILED: boolean[] = [];
  IS_REMOVED: boolean[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private dbService: DbService,
    private authService: AuthService,
    private appService: AppService) {

    this.dbService.getItemsFromFBReturnPromise('FavoriteOfUserForItems/' + this.navParams.data)
      .then((snapshot: any[]) => {
        snapshot.forEach(snap => {
          console.log(snap.val());
          console.log(snap.key);
          this.favorites.push({key: snap.key, item: snap.val().item, date: snap.val().date });
          return false;
        })
      })
      .then(() => {
        // console.log(this.favorites);
        this.favorites.forEach(favorite => {
          this.dbService.getOneItemReturnPromise('soldItems/' + favorite.item)
            .then((data) => {
              let fav = data.val();
              fav['new_PRICE'] = this.appService.convertToCurrency(fav.PRICE.toString(), ','); // convert PRICE
              fav['new_KIND'] = this.appService.convertCodeToDetail(fav.KIND); // convert KIND
              console.log(fav);
              let item = {
                _key: favorite.key,
                data: fav,
                key: favorite.item
              }
              this.favDetails.push(item);
              this.IS_DETAILED.push(false);
              this.IS_REMOVED.push(false);
            })
        })
        console.log('final:', this.favDetails);
        console.log('final2: ', this.IS_DETAILED);
      })
      .catch(err => {
        console.log(err);
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoriteViewPage');
  }


  // goToItemDetail(key: string){
  //   // this.navCtrl.push(ShowItemDetailPage, key);
  //   console.log(key);
  // }

  showMore(i){
    this.IS_DETAILED[i] = true;
    console.log('Show More...', i);
  }

  showLess(i){
    this.IS_DETAILED[i] = false;
    console.log('Show Less...', i);
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
    this.dbService.removeOneItemFromDBReturnPromise(key,'FavoriteOfUserForItems/'+this.authService.uid)
    .then((res)=>{
      this.IS_REMOVED[index]=true;
      console.log('item removed', res);
    })
    .catch(err=>{
      console.log('Error:', err)
    })
  }

}
