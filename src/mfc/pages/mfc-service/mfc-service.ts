import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import _ from "lodash";
import {MfcDatePage} from "../mfc-date/mfc-date";

/*
 Generated class for the MfcService page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-mfc-service',
  templateUrl: 'mfc-service.html'
})
export class MfcServicesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController) {
  }

  private _subservice = [];

  ngAfterContentInit() {
    let loader = this.loadingCtrl.create({
      content: "Загрузка..."
    })
    loader.present();
    this._subservice.push(...this.navParams.get('subservice'));
    loader.dismissAll();
  }


  ionViewDidLoad() {
  }


  private GetSubservice(item) {
    _.has(item, 'SubItems') ?
      (this._subservice = [], this._subservice.push(...item.SubItems)) : this.navCtrl.push(MfcDatePage, {
        productId: item.Id,
        product: item.Product.RequiredFields
      });
  }
}
