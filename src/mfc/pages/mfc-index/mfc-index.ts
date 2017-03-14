import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {MfcServicesPage} from "../mfc-service/mfc-service";
import {MfcProvider} from "../../providers/mfc";
import _ from "lodash";
/*
 Generated class for the MfcIndex page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-mfc-index',
  templateUrl: 'mfc-index.html'
})
export class MfcIndexPage {
  private _services: any = [];

  constructor(public navCtrl: NavController, private mfc: MfcProvider,private loadingCtrl:LoadingController) {
  }

  ionViewDidLoad() {
    this._GetServices();
  }

  private GetSubServices(subservice:any) {
    this.navCtrl.push(MfcServicesPage, {subservice:subservice})
  }

  private _GetServices() {
    let loader = this.loadingCtrl.create({
      content: "Загрузка..."
    })
    loader.present();
    this.mfc.GetServices().then(res => {

      try {
        loader.dismissAll();
        _.has(res, 'MenuItems') && res.MenuItems.length > 0 ?
          this._services.push(...res.MenuItems)
          :
          false;
      }
      catch (err) {
        loader.dismissAll();
        console.error("Произошла ошибка", err)
      }
    }).catch(err => {
      loader.dismissAll();
      console.log(err)
    })
  }
}
