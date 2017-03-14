import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {MfcProvider} from "../../providers/mfc";
import {MfcTimePage} from "../mfc-time/mfc-time";

import _ from "lodash";
import {CommonToast} from "../../classes/toast.class";

/*
 Generated class for the MfcDateTime page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-mfc-date',
  templateUrl: 'mfc-date.html'
})
export class MfcDatePage {
  data: any = [];
  id: any;
  product: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private mfcservice: MfcProvider, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {

    this.id = this.navParams.get('productId');
    this.product = this.navParams.get('product');
    this._GetDays();
  }

  private _GetDays() {
    let loader = this.loadingCtrl.create({
      content: "Загрузка..."
    })
    loader.present();
    try {
      this.mfcservice.GetDays(this.id).then(res => {
        loader.dismissAll();
        this.data.push(...res)
      }).catch(err => {
        console.error(err);
        loader.dismissAll();
      })
    }
    catch (err) {
      loader.dismissAll();
      console.error("Произошла ошибка", err)
    }

  }

  private _GetTime(dd, mm, YYYY) {
    let loader = this.loadingCtrl.create({
      content: "Загрузка..."
    })
    loader.present();
    mm < 10 ? mm = '0' + mm : false;
    dd < 10 ? dd = '0' + dd : false;
    let d: any = [dd, mm, YYYY].join('.');
    try {
      this.mfcservice.GetHours(d, this.id)
        .then(res => {
          loader.dismissAll();
          let hours = _.filter(res, {'Free': false});
          hours.length < res.length ?
            this.navCtrl.push(MfcTimePage, {data: {time: res, date: d, id: this.id, product: this.product}})
            :
            CommonToast.ShowToast('К сожалению, доступного времени для записи на этот день уже нет');
        }).catch(err => {
        loader.dismissAll();
        CommonToast.ShowToast('Произошла ошибка при получении времени для записи');
      });
    }
    catch (err) {
      loader.dismissAll();
      CommonToast.ShowToast('Произошла ошибка при получении времени для записи');
      console.error("Произошла ошибка", err)
    }
    //
  }
}
