import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {GeolocationProvider} from "../../providers/geolocation-provider";
// declare var ymaps: any;

@Component({
  selector: 'page-object-detail',
  templateUrl: 'object-detail.html'
})
export class ObjectDetailPage {
  data: Object;
  street: string = 'Загрузка...';

  constructor(public navCtrl: NavController, public navParams: NavParams, private locationprov: GeolocationProvider) {
    this.data = navParams.data;
    console.info(this.data);
  }

  ionViewDidLoad() {

    this._GetLocation(this.data['Lat_t'], this.data['Long_t']);

    // console.log('Hello ObjectDetailPage Page', this.data);
    // ymaps.ready().then(() => [this.data['Lat_t'], this.data['Long_t']])
    //   .then((ll) => ymaps.geocode(ll, { kind: 'street' }))
    //   .then(res =>
    //     // Выведем в консоль данные, полученные в результате геокодирования объекта.
    //     res.geoObjects.get(0)
    //   ).then(street => {
    //     console.log(street.properties.get('name'))
    //     this.data['street'] = street.properties.get('name')
    //     this.street = street.properties.get('name')
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })


  }

  getDate(item_date: string) {
    let date = new Date(item_date.replace(/-/g, "/"));
    return ([date.getDay(), date.getMonth() + 1, date.getFullYear()].join('.'))
  }

  /**
   * Реверсивная геолокация
   * @param lat
   * @param lng
   * @private
   */
  private _GetLocation(lat, lng) {
    this.locationprov.GetReverse(lat, lng).then((res: any) => {
      this.street = res.streetName;
    }).catch(err => {
      this.street = 'Не указано';
    });
  }

  // getLocation(lat: number, lon: number) {
  //   console.log('into function')
  //   ymaps.ready().then(() => [lat, lon])
  //     .then((ll) => ymaps.geocode(ll, { kind: 'street' }))
  //     .then(res =>
  //       // Выведем в консоль данные, полученные в результате геокодирования объекта.
  //       res.geoObjects.get(0)
  //     ).then(street => {
  //       console.log(street.properties.get('name'))
  //       return street.properties.get('name')
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }

}
