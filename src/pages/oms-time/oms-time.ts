import {Component} from '@angular/core';
import {
  NavController, NavParams, LoadingController, ToastController, AlertController,
  PopoverController
} from 'ionic-angular';
import {OmsProvider} from '../../providers/oms-provider'
import {OmsBookFormPage} from '../oms-book-form/oms-book-form'
import {PopoverPage} from "../popover-page/popover-page";
import {Toast} from "ionic-native";
import _ from "lodash";


@Component({
  selector: 'page-oms-time',
  templateUrl: 'oms-time.html',
  providers: [OmsProvider]
})
export class OmsTimePage {
  title: string = this.navParams.data.item.name
  notEmpty: boolean = true;
  data: any

  constructor(public navCtrl: NavController,
              public oms: OmsProvider,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private popoverCtrl: PopoverController,
              private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: 'Загрузка...'
    })
    loader.present();
    this._GetTime().then(()=>{loader.dismiss();});
    // this.oms.getTime(this.navParams.data.item.id).subscribe(res => {
    //   console.info(res.json());
    //   if (res.json()[0].date == "Нет времени для записи") {
    //     this.notEmpty = false;
    //     loader.dismiss();
    //     return false;
    //   } else {
    //     this.data = res.json();
    //     loader.dismiss();
    //   }
    // }, err => {
    //   let toast = this.toastCtrl.create({
    //     message: 'Ошибка получения данных',
    //     duration: 3000
    //   })
    //   loader.dismiss()
    //   toast.present()
    //   this.navCtrl.pop()
    // })
    console.log('Hello OmsTimePage Page');
  }

  private _ToastPresent(msg: string = null) {
    if (msg) {
      Toast.show(msg, '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        }
      );
    }
  }

  private _GetTime() {
    return new Promise((resolve, reject) => {
      try {
        this.oms.GetTime(this.navParams.data.item.id).then(res => {
          console.info(res, "RES OMS TIME");
          res && !_.isObject(res) ?
            (this._ToastPresent(res),this.notEmpty = false) :
            _.has(res, "time") && res.time.length > 0 ?
              (this.data = res, this.notEmpty = true) : this.notEmpty = false;
          resolve()
        }).catch(err => {
          this.notEmpty = false;
          resolve();
          console.error("Произошла ошибка", err);
        })
      }
      catch (err) {
        this.notEmpty = false;
        resolve();
        console.error("Произошла ошибка", err);
      }
    })
  }


  bookTime(datetimeObj: Object, time: any) { // Запись по времени
    // TODO Переход на страницу с формой (oms-book-form), оттуда отправка данных
    datetimeObj['selectedTime'] = time
    this.navCtrl.push(OmsBookFormPage, {item: this.navParams.data.item, datetimeObj})
  }

  bookLive() { // Живая очередь
    let serviceId = this.navParams.data.item.id
    let loader = this.loadingCtrl.create({
      content: 'Запись...'
    })
    loader.present()
    let date = new Date()
    let datetimeObj = { // TODO текущая дата и время
      date: date.getDate() + "." + date.getMonth() + 1 + "." + date.getFullYear(),
      time: date.getHours() + ":" + date.getMinutes()
    }
    console.log(datetimeObj)
    this.oms.bookLive(serviceId, datetimeObj).subscribe(res => {
      loader.dismiss()
      loader = this.loadingCtrl.create({
        content: 'Запись...'
      })
      loader.present()
      let data = res.json()[0]

      this.oms.GetDocuments(serviceId).then(docs => {

      }).catch(err => {
      });


      this.oms.getDocuments(serviceId).then(documents => {

        let popover = this.popoverCtrl.create(PopoverPage);


        // let alert = this.alertCtrl.create({
        //   title: 'Вы записались!',
        //   subTitle: 'Номер в очереди: ' + data.seq_pos + '.<br>Не забудьте документы:' + documents,
        //   buttons: ['OK']
        // });
        this.navCtrl.popToRoot()
        loader.dismiss();
        popover.present();
        // alert.present();
      }, err => {
        loader.dismiss()
        let toast = this.toastCtrl.create({
          message: 'Произошла ошибка про записи',
          duration: 3000
        })
        toast.present()
      })
    }, err => {
      loader.dismiss()
      let toast = this.toastCtrl.create({
        message: 'Произошла ошибка про записи',
        duration: 3000
      })
    })
  }

}
