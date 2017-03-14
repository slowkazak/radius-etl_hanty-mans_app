import { Component } from '@angular/core';
import { NavController, NavParams,PopoverController } from 'ionic-angular';
import _ from "lodash";
import {OrderPopoverPage} from "../order-popover/order-popover";
/*
  Generated class for the MfcTime page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-mfc-time',
  templateUrl: 'mfc-time.html'
})
export class MfcTimePage {
private time:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public popoverCtrl: PopoverController) {}

  ionViewDidLoad() {
this._PrepateTime();
    // console.log(this.navParams.get('data'));

  }

  private _PrepateTime(){
    try {
      _.forEach(this.navParams.get('data').time, (item:any)=>{
        item.Minutes<10? item.Minutes = '0'+item.Minutes:false;
        this.time.push(item);
      })
    }
    catch (err) {
      console.error("Произошла ошибка", err)
    }
  }
  private TryOrder(hh,mm){
    try {
      let data = {
        time:hh+':'+mm,
        date:this.navParams.get('data').date,
        id:this.navParams.get('data').id,
        reqid:this.navParams.get('data').product[0].Id
      };
      let popover = this.popoverCtrl.create(OrderPopoverPage,{data:data},{enableBackdropDismiss:true});
      popover.present({
      });
      popover.onDidDismiss(
        (ev) => {
          this.navCtrl.popToRoot();
        })
    }
    catch (err) {
      console.error("Произошла ошибка", err)
    }
  }
}
