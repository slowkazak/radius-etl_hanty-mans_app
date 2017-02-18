import {Component} from '@angular/core';
import {NavController, LoadingController,} from 'ionic-angular';
// import {Geolocation, Dialogs, Toast} from 'ionic-native';
import {MenuPage} from '../menu/menu'
import {AuthProvider} from '../../providers/auth-provider'

import _ from "lodash";
import {GeolocationProvider} from "../../providers/geolocation-provider";
import {LocationData} from "../../app/interfaces/location.interface";
import {settings} from "../../app/settings/settings";
import {Toast} from 'ionic-native';
import {LengProvider} from "../../providers/leng-provider";

import {NewsFeedPage} from "../news-feed/news-feed";
declare var ymaps: any;

/*
 Generated class for the Location page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-location',
  templateUrl: 'location.html'
})
export class LocationPage {
  items: any = settings.citylist;
  searchQuery: string = ''


  private _leng: any = {};

  constructor(private locationprov: GeolocationProvider,
              private leng: LengProvider,
              public navCtrl: NavController, public loadingCtrl: LoadingController, public auth: AuthProvider) {
    this.initializeItems()
  }


  ionViewDidLoad() {


    this.leng.GetLeng("getlocation").then(res => {
      this._leng = _.assign({}, res);
    }).catch(err => {
      this._leng = _.assign({}, err);
    });
  }

  /**
   * инициализация и отображение тоста
   * @param msg
   * @private
   */
  private _ToastPresent(msg: string = null) {
    if (msg) {
      Toast.show(msg, '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        }
      );
    }
  }

  /**
   * Определение города по геопозиции
   * @private
   */
  private _GetLocation() {
    let _callback = (lat: number, lng: number) => {
      console.info(lat, lng);
      ymaps.ready()
        .then(() => ymaps.geocode([lat, lng], {kind: 'locality'}))
        .then(res => {
        console.info(res.geoObjects.get(0))
        try {
            res = res.geoObjects.get(0).getLocalities().pop();
            }
        catch(err){
        res = [12,12];
        }
            let city = this._FindCity(res);
            city ?
              this.goToMenu(city) : this._ToastPresent(this._leng.city_not_found)
          }
        )
        .catch(err => {
            console.error(err)
            this._ToastPresent(this._leng.city_not_found);
          }
        )
    };
    let loader = this.loadingCtrl.create({
      content: "Загрузка..."
    })
    loader.present();
    this.locationprov.GetLocation()
      .then((res: LocationData) => {

        _callback(res.lat, res.lng);
        loader.dismiss();
      })
      .catch((err: LocationData) => {
        this._ToastPresent(this._leng.city_default);
        _callback(err.lat, err.lng);
        loader.dismiss();
      });
  }


  /**
   * Поиск города из настроек
   * @param city
   * @returns {null}
   * @private
   */
  private _FindCity(city: string) {

    let _city = null;
    try {
      _city = settings.citylist.filter(item => item.name === city).pop();
    }
    catch (err) {
      console.error("Невозможно найти город, критическая ошибка", err)
    }
    return _city;
  }


  //todo рефактор, затем удалить


  getItems(event: any) {
    this.initializeItems()
    let val = event.target.value
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1)
      })
    }
    // console.log(event.target.value)
  }

  test = 1

  goToMenu(city: string) {
    this.auth.set('city', city);
    this.auth.updateStorage();
    this.navCtrl.setRoot(NewsFeedPage, {}, {animate: true, direction: 'forward'})
  }

  private findCity(city: String) {
    let res = this.items.filter(item => {
      return item.name.indexOf(city) > -1
    })[0]
    if (!res) {
    }
    // this.toastCtrl.create({
    //   message: 'Не удалось определить город. Пожалуйста, выберете вручную',
    //   duration: 3000
    // }).present()
    else {
      this.goToMenu(res.name)
    }
    console.log(res)
    return res
  }

  // public getPosition() {
  //   let loader = this.loadingCtrl.create({
  //     content: "Пожалуйста, подождите"
  //   })
  //   loader.present()
  //
  //
  //   ymaps.ready().then(() => Geolocation.getCurrentPosition())
  //     .then((res) => [res.coords.latitude, res.coords.longitude])
  //     .then((ll) => ymaps.geocode(ll, {kind: 'locality'}))
  //     .then(res =>
  //       // Выведем в консоль данные, полученные в результате геокодирования объекта.
  //       res.geoObjects.Get(0).getLocalities()
  //     ).then(city => {
  //     this.findCity(city[0])
  //     loader.dismiss()
  //   })
  //     .catch(err => {
  //       Dialogs.alert('Не удалось определить местоположение', 'Ошибка')
  //       this.toastCtrl.create({
  //         message: 'Не удалось определить местоположение. Пожалуйста, выберете город вручную',
  //         duration: 3000
  //       }).present()
  //       loader.dismiss()
  //       console.log(err)
  //     })
  // }

  initializeItems() {
    this.items = [{
      name: 'Белоярский',
      state: 'Белоярский район'
    },
      {
        name: 'Когалым',
        state: 'МО город Когалым'
      },
      {
        name: 'Лангепас',
        state: 'МО город Лангепас'
      },
      {
        name: 'Лянтор',
        state: 'Сургутский район'
      },
      {
        name: 'Мегион',
        state: 'МО город Мегион'
      },
      {
        name: 'Нефтеюганск',
        state: 'МО город Нефтеюганск'
      },
      {
        name: 'Нижневартовск',
        state: 'МО город Нижневартовск'
      },
      {
        name: 'Нягань',
        state: 'МО город Нягань'
      },
      {
        name: 'Покачи',
        state: 'МО город Покачи'
      },
      {
        name: 'Пыть-Ях',
        state: 'МО город Пыть-Ях'
      },
      {
        name: 'Радужный',
        state: 'МО город Радужный'
      },
      {
        name: 'Советский',
        state: 'Советский район'
      },
      {
        name: 'Сургут',
        state: 'Городской округ город Сургут'
      },
      {
        name: 'Урай',
        state: 'МО город Урай'
      },
      {
        name: 'Ханты-Мансийск',
        state: 'МО город Ханты-Мансийск'
      },
      {
        name: 'Югорск',
        state: 'МО город Югорск'
      }]
  }

}
