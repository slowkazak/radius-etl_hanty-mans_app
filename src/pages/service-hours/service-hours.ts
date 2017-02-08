import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider'
import { ServiceProvider } from '../../providers/service-provider'
import moment from 'moment'

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
    console.log(item)
    this.service.getToken().then(token => {
      loader.dismiss()
      console.log('Token: ' + token)
      this.bookHour(token, item, name)
    }, error => {
      loader.dismiss()
      console.log(error)
    })
  }

  private formatNumber(month: any) {
    return ((month) < 10 ? '0' + month : month)
  }

  private bookHour(token: any, item: any, name: string) {
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
    this.service.book(time, this.navParams.data.item, token).then(res => {
      loader.dismiss()
      let alert = this.alertCtrl.create({
        title: 'Вы записались!',
        subTitle: 'Ждём вас ' + date + ' в ' + hours + '.\nНе забудьте паспорт.',
        buttons: ['OK']
      });
      alert.present();
      this.navCtrl.popToRoot()
      console.log(res)
    }, err => {
      loader.dismiss()
      console.log(err)
    })
  }

  showPrompt(item: any) {
    let prompt = this.alertCtrl.create({
      title: 'Подтверждение записи',
      message: "Записаться на выбранную услугу?",
      inputs: [
        {
          name: 'second_name',
          placeholder: 'Фамилия',
          value: this.auth.user.second_name
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
