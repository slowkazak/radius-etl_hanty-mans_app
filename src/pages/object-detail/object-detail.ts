import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
declare var ymaps: any;

@Component({
  selector: 'page-object-detail',
  templateUrl: 'object-detail.html'
})
export class ObjectDetailPage {
  data: Object
  street: string = 'Загрузка...'

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = navParams.data
  }

  ionViewDidLoad() {
    console.log('Hello ObjectDetailPage Page', this.data);
    ymaps.ready().then(() => [this.data['Lat_t'], this.data['Long_t']])
      .then((ll) => ymaps.geocode(ll, { kind: 'street' }))
      .then(res =>
        // Выведем в консоль данные, полученные в результате геокодирования объекта.
        res.geoObjects.get(0)
      ).then(street => {
        console.log(street.properties.get('name'))
        this.data['street'] = street.properties.get('name')
        this.street = street.properties.get('name')
      })
      .catch(err => {
        console.log(err)
      })
  }

  getDate(item_date: string) {
    console.log('into date', item_date)
    let date = new Date(item_date.replace(/-/g, "/"));
    console.log(date)
    return ([date.getDay(), date.getMonth() + 1, date.getFullYear()].join('.'))
  }

  getLocation(lat: number, lon: number) {
    console.log('into function')
    ymaps.ready().then(() => [lat, lon])
      .then((ll) => ymaps.geocode(ll, { kind: 'street' }))
      .then(res =>
        // Выведем в консоль данные, полученные в результате геокодирования объекта.
        res.geoObjects.get(0)
      ).then(street => {
        console.log(street.properties.get('name'))
        return street.properties.get('name')
      })
      .catch(err => {
        console.log(err)
      })
  }

}
