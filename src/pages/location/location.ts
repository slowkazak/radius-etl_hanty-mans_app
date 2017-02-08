import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation, Dialogs, Toast } from 'ionic-native';
import { MenuPage } from '../menu/menu'
import { AuthProvider } from '../../providers/auth-provider'
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
  items: any
  searchQuery: string = ''
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public auth: AuthProvider) {
    this.initializeItems()
  }


  ionViewDidLoad() {
    // Geolocation.getCurrentPosition().then((res) => {
    //   console.log(res)
    // })
    console.log('Hello LocationPage Page');
  }


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
    this.auth.set('city', city)
    this.auth.updateStorage()
    this.navCtrl.setRoot(MenuPage, {}, {animate: true, direction: 'forward'})
  }

  private findCity(city: String) {
    let res = this.items.filter(item => {
      return item.name.indexOf(city) > -1
    })[0]
    if (!res)
      this.toastCtrl.create({
        message: 'Не удалось определить город. Пожалуйста, выберете вручную',
        duration: 3000
      }).present()
    else {
      this.goToMenu(res.name)
    }
    console.log(res)
    return res
  }

  public getPosition() {
    let loader = this.loadingCtrl.create({
      content: "Пожалуйста, подождите"
    })
    loader.present()
    ymaps.ready().then(() => Geolocation.getCurrentPosition())
      .then((res) => [res.coords.latitude, res.coords.longitude])
      .then((ll) => ymaps.geocode(ll, { kind: 'locality' }))
      .then(res =>
        // Выведем в консоль данные, полученные в результате геокодирования объекта.
        res.geoObjects.get(0).getLocalities()
      ).then(city => {
        this.findCity(city[0])
        loader.dismiss()
      })
      .catch(err => {
        Dialogs.alert('Не удалось определить местоположение', 'Ошибка')
        this.toastCtrl.create({
          message: 'Не удалось определить местоположение. Пожалуйста, выберете город вручную',
          duration: 3000
        }).present()
        loader.dismiss()
        console.log(err)
      })
  }

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
