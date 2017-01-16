import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {
  items = [];  // very important, items=[] works. items: Any[], Array<any> not work
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.getAllItemsOnce('items');
    // this.updateItem(2, "Item 2", "Day la item a 2");
    this.onItemChanged(2);
    this.onAnyItemChanged('items');
    this.removeAllItems('itemsk');
    this.removeItem('items', 5);
    this.onItemsChanged('items');
    this.sortGetTheLastAddedItem('items');
    this.queryCondition('businesses', 3, true);
    this.syncDownFromServer('items');
    this.insertNewItem('CanTho', "Ninh Kieu", "items");


  }

  // update if item existing, create if item not exist
  updateItem(key, name, body) {
    let item = firebase.database().ref('items/' + key);
    item.set({
      body: body,
      name: name
    }, () => {
      console.log('update completed');
    }), onerror => console.log('err occur', onerror);
  }

  insertNewItem(name, body, dbName){
    let items = firebase.database().ref(dbName);
    let item ={
      name: name,
      body: body
    };
    items.push(item).then(()=>{
      console.log(item, ' just inserted successfully');
    }, err => console.log('error when inserted'))
  }

  onItemChanged(id) {
    let item = firebase.database().ref('items/' + id);
    item.on('value', (snapshot) => {
      console.log(snapshot.val());
    })
  }

  onAnyItemChanged(dbName: string) {
    let items = firebase.database().ref(dbName);
    items.on('value', (snapshot) => {
      snapshot.forEach(
        (childSnap) => {
          console.log('Item changed new: ', childSnap.val().name + ' - ' + childSnap.val().body);
          return false;
        })
    })
  }

  // EVENTS LISTENER
  onItemsChanged(dbName: string) {
    let items = firebase.database().ref(dbName);
    items.on('value', (snaphot) => {
      console.log('value: ', snaphot.val());
    });
    items.on('child_added', (snaphot) => {
      console.log('child_added: ', snaphot.val());
    });
    items.on('child_removed', (snaphot) => {
      console.log('child_removed: ', snaphot.val());
    });
    items.on('child_changed', (snaphot) => {
      console.log('child_changed: ', snaphot.val());
    });
    items.on('child_moved', (snaphot) => {
      console.log('child_moved : ', snaphot.val());
    });
  }


  sortGetTheLastAddedItem(dbName: string) {
    let items = firebase.database().ref(dbName);
    items.orderByKey().limitToLast(1).on('child_added', (snapshot) => {
      let item = {
        key: snapshot.key,
        body: snapshot.val().body,
        name: snapshot.val().name
      };
      console.log(item, ' just added!!');
    });
  }

  removeAllItems(dbName) {
    let items = firebase.database().ref(dbName);
    items.remove();
  }

  removeItem(dbName, id) {
    let items = firebase.database().ref(dbName);
    items.child(id).remove();
  }

  queryCondition(dbName: string, limit: number, orderByKey: boolean) {
    var array = [];
    let items = firebase.database().ref(dbName);
    items.orderByKey().limitToLast(limit).on('value', snapshots => {
      snapshots.forEach(snapshot => {
        array.push(snapshot.val());
        return false;
      })
    })
    console.log(array);
  }

  syncDownFromServer(dbName) {
    let items = firebase.database().ref(dbName);
    items.on('value', (snapshot) => {
      snapshot.forEach(childSnap => {
        this.items.push(
          {
            key: childSnap.key,
            data: childSnap.val()  // data { body: 'BODY', name: 'NAME'}
          }
        );
        return false;
      })
    });
  }

  getAllItemsOnce(dbName) {
    let items = firebase.database().ref(dbName);
    items.once('value', (snapshot) => {
      snapshot.forEach(childSnap => {
        let item = {
          key: childSnap.key,
          body: childSnap.val().body,
          name: childSnap.val().name
        }
        // this.items.push(item);
        console.log(item);
        console.log('Once new: Key:' + childSnap.key + ", body: " + childSnap.val().body + ", name: " + childSnap.val().name);
        return false;
      });
    })
  }

}
