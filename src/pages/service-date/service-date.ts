import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service-provider'
import { ServiceHoursPage } from '../service-hours/service-hours'

/*
  Generated class for the ServiceDate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-service-date',
  templateUrl: 'service-date.html',
  providers: [ServiceProvider]
})
export class ServiceDatePage {
  title: string = this.navParams.data.item.Name
  id: any = this.navParams.data.item.Id
  data: any = this.navParams.data.dates

  constructor(public navCtrl: NavController, public navParams: NavParams, private service: ServiceProvider, public loadingCtrl: LoadingController) { }

  ionViewDidLoad() {
    console.log('Hello ServiceDatePage Page');
    console.log('Fields: ', this.navParams.data.item.Product.RequiredFields)
  }

  getMonthName(year: number, month: number) {
    let date = new Date(year + '-' + month)
    let options = {
      month: 'long'
    };
    date.toLocaleString('ru', options)
    let name = date.toLocaleString('ru', options)
    name = name[0].toUpperCase() + name.slice(1)
    return name
  }

  getDate(day: number, month: number, year: number) {
    let date = new Date(year + '-' + month + '-' + day)
    let options = {
      month: 'long',
      day: 'numeric'
    };
    date.toLocaleString('ru', options)
    let name = date.toLocaleString('ru', options)
    return name
  }

  selectHours(day: number, month: any, year: number) {
    let loader = this.loadingCtrl.create({
      content: "Пожалуйста, подождите"
    })
    loader.present()
    if (month <10) month = '0' + month
    let date:any = [day,month,year].join('.')
    this.service.getHours(this.id, date).subscribe(res => {
      loader.dismiss()
      date = new Date([year,month,day].join('-'))
      this.navCtrl.push(ServiceHoursPage, {hours: res.json(), title: this.title, date, item: this.navParams.data.item})
      console.log(res.json())
    }, err => {
      loader.dismiss()
      console.log(err)
    })
  }

}
