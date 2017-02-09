import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { OmsProvider } from '../../providers/oms-provider'
import { OmsTimePage } from '../oms-time/oms-time'

@Component({
  selector: 'page-oms-page',
  templateUrl: 'oms-page.html',
  providers: [OmsProvider]
})
export class OmsPage {
  data: any
  title: string = this.navParams.data.item ? this.navParams.data.item.name : 'Услуги ОМС'

  constructor(public navCtrl: NavController, public oms: OmsProvider, public navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {}

  ionViewDidLoad() {
    if (this.navParams.data.item) {
      let loader = this.loadingCtrl.create({
        content: "Загрузка..."
      })
      loader.present()
      this.oms.get(this.navParams.data.item.id).subscribe(res => {

        this.data = res.json();
        console.log("OMS",this.data)
        loader.dismiss()
      }, err => {
        loader.dismiss()
        let toast = this.toastCtrl.create({
          message: 'Ошибка получения данных',
          duration: 3000
        })
        toast.present()
        this.navCtrl.popToRoot()
      })
    } else {
      this.data = this.oms.services
    }
    console.log('Hello OmsPagePage Page');
  }

  openItem(item: any) {
    if (this.navParams.data.item) this.navCtrl.push(OmsTimePage, {item})
    else this.navCtrl.push(OmsPage, {item})
  }



}
