import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider'
import { ServiceProvider } from '../../providers/service-provider'
import moment from 'moment'
import {CommonToast} from "../../helpers/toast.class";

@Component({
  selector: 'page-service-hours',
  templateUrl: 'service-hours.html',
  providers: [ServiceProvider]
})
export class ServiceHoursPage {
  title: string = this.navParams.data.title
  hours: any = this.navParams.data.hours
  date: any

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private service: ServiceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private auth: AuthProvider
  ) {
    let options = {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }
    moment.locale('ru')
    this.date = moment(this.navParams.data.date).format('DD MMMM YYYY')
    // this.date = this.navParams.data.date.toLocaleString('ru', options)
  }

  ionViewDidLoad() {
    console.log(this.title, this.hours, this.date)
    console.log('Hello ServiceHoursPage Page');
  }

  requestPermission(item: any, name: string) {
    console.log(this.navParams.data.date, this.navParams.data.item, item)
    let loader = this.loadingCtrl.create({
      content: "Получаем разрешение..."
    })
    loader.present()
    try {
      this.service.getToken().then(token => {
        loader.dismiss()
        console.log('Token: ' + token)
        this.bookHour(item, name,token)
      }, error => {

        this.bookHour(item, name)
        CommonToast.ShowToast('Извините, запись на это время невозможна');
        loader.dismiss()

      })
    }
    catch (err) {

      console.error("Произошла ошибка", err)
    }

  }

  private formatNumber(month: any) {
    return ((month) < 10 ? '0' + month : month)
  }
//token: any,
  private bookHour( item: any, name: string,token: any =null) {
    let loader = this.loadingCtrl.create({
      content: "Записываемся..."
    })
    loader.present()
    let hours = item.Hour.toString() + ':' + (item.Minutes === 0 ? '00' : item.Minutes.toString())
    let date = [this.formatNumber(this.navParams.data.date.getDate()), this.formatNumber(this.navParams.data.date.getMonth() + 1), this.navParams.data.date.getFullYear()].join('.')
    let time = {
      hours,
      date
    }
    let sssd =this.navParams.data.item;
    sssd.second_name = name;
    // console.info(this.navParams.data,2222222222222222222222)
    this.service.book(time, this.navParams.data.item, token).then(res => {
      loader.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Вы записались!',
        subTitle: 'Ждём вас ' + date + ' в ' + hours + '.\nНе забудьте паспорт.',
        buttons: ['OK']
      });
      alert.present();
      this.navCtrl.popToRoot();
      console.log(res)
    }, err => {

      loader.dismiss()

      // alert.present();

      console.log(err)
    })
  }

  showPrompt(item: any) {
let n=''
  try {n = this.auth.user.user.second_name} catch(err){}
    let prompt = this.alertCtrl.create({
      title: 'Подтверждение записи',
      message: "Записаться на выбранную услугу?",
      inputs: [
        {
          name: 'second_name',
          placeholder: 'Фамилия',
          value: n
        },
      ],
      buttons: [
        {
          text: 'Отмена',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Записаться',
          handler: data => {
            if (!data.second_name) return false
            console.log('Saved clicked', data);
            this.requestPermission(item, data.second_name)
          }
        }
      ]
    });
    prompt.present();
  }

}
