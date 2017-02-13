import {Component} from '@angular/core';
import {NavController, LoadingController} from 'ionic-angular';
import {Http, URLSearchParams, Headers} from '@angular/http';
import {AuthProvider} from '../../providers/auth-provider'

import _ from "lodash";

import {
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapsLatLng,
  CameraPosition,
  GoogleMapsMarkerOptions,
  GoogleMapsMarker
} from 'ionic-native'

@Component({
  selector: 'page-user-objects',
  templateUrl: 'user-objects.html'
})
export class UserObjectsPage {
  user_object: any = null
  _ymaps = null;

  constructor(public navCtrl: NavController, public http: Http, public auth: AuthProvider, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: "Пожалуйста, подождите"
    })
    loader.present()
    console.log('Hello UserObjectsPage Page');
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded')
    let params = new URLSearchParams()
    params.set('access_token', this.auth.user.access_token)
    params.set('user_id', this.auth.user.user_id)
    let body = params.toString()
    this.http.post('http://api.admhmansy.ru/place/plist', body, {headers: headers}).subscribe(res => {
      this.user_object = res.json()
      // this.loadMap()
      this.user_object.length > 0 ? _.forEach(this.user_object, (item) => {
          try {
            item.coordinates ?  (item.coordinates = JSON.parse(item.coordinates),
              this._InitMap(item.coordinates[0],item.coordinates[1],item.placemark_id,item.description))
          :
            false
          }
          catch (err) {
            console.info("cant iterate coords", item.coordinates)
          }
        }) : false;
console.info(this.user_object)
      loader.dismiss()
    }, err => {
      console.log(err.json())
      loader.dismiss()
    })
  }


  private _InitMap(lat: number, lng: number, id, marker_title) {
    let init = () => {
      this._ymaps = new ymaps.Map(id, {
        center: [lat, lng],
        zoom: 13,
        controls: []
      });


    };
    ymaps.ready(init).then(()=>this._SetMarker(lat,lng, marker_title));
  }

  private _SetMarker(lat: number, lng: number, title: string = '') {

    try {
      let _callback = (lat: number, lng: number) => {

        let myPlacemark = new ymaps.Placemark(
          [lat, lng], {
            balloonContent: '',
            iconCaption: title
          }, {
            preset: 'islands#greenDotIconWithCaption'
          }
        );
        this._ymaps.geoObjects.removeAll();
        this._ymaps.geoObjects.add(myPlacemark);
      };

      _callback(lat, lng);
    }
    catch (err) {
      console.info("Невозможно установить метку", err);
    }
  }


//TODO рефактор
  loadMap() {
    let element: HTMLElement = document.getElementById('map')
    let map = new GoogleMap(element)

    map.one(GoogleMapsEvent.MAP_READY).then(() => {
      console.log('Map is ready!')
      let pos: GoogleMapsLatLng = new GoogleMapsLatLng(61.008038, 69.035848)

      let position: CameraPosition = {
        target: pos,
        zoom: 13,
        tilt: 30
      }

      map.moveCamera(position)
      this.user_object.forEach(item => {
        let coords = JSON.parse(item.coordinates)
        let pos: GoogleMapsLatLng = new GoogleMapsLatLng(coords[0], coords[1])
        let markerOptions: GoogleMapsMarkerOptions = {
          position: pos
          // title: 'Ionic'
        };
        // console.log(markerOptions)
        map.addMarker(markerOptions).then((marker: GoogleMapsMarker) => {
          marker.showInfoWindow();
        });
      })
    })

  }
}
