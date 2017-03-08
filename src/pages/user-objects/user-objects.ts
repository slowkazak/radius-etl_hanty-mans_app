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
import {settings} from "../../app/settings/settings";

@Component({
  selector: 'page-user-objects',
  templateUrl: 'user-objects.html'
})
export class UserObjectsPage {
  user_object: any = null
  _ymaps = null;
  private _file_url = '';
  // private _status_list = [];

  constructor(public navCtrl: NavController, public http: Http, public auth: AuthProvider, public loadingCtrl: LoadingController) {
    this._file_url = settings.files_url;
    // this._status_list.push(...settings.status_type_id);
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
    params.set('login', this.auth.user.EMAIL)
    let body = params.toString()
    this.http.post('http://api.admhmansy.ru/place/plist', body, {headers: headers}).subscribe(res => {
      this.user_object = res.json()
      console.info(this.user_object);
      // this.loadMap()
      try {
        this.user_object.length > 0 ? _.forEach(this.user_object, (item: any) => {
            try {
              item.status_type_id = _.find(settings.status_type_id, _.matchesProperty('id', parseInt(item.status_type_id)));
              item.user_image = item.user_image.split(',');
              item.Long_t > 0 && item.Lat_t > 0 ? this._InitMap(item.Lat_t, item.Long_t, item.id, item.user_message) : false;
              loader.dismiss()
            }
            catch (err) {
              loader.dismiss()
              console.info("cant iterate coords", item.coordinates)
            }
          }) : false;

      }
      catch (err) {
        loader.dismiss()
        console.error("Произошла ошибка", err)
      }

      console.info(this.user_object)

    }, err => {
      console.log(err.json())
      loader.dismiss()
    })
  }


  private _InitMap(lat: number, lng: number, id, marker_title) {
    let maps = null;
    let init = () => {
      maps = new ymaps.Map(id, {
        center: [lat, lng],
        zoom: 13,
        controls: []
      });
      maps.behaviors.disable('drag');
      // maps.behaviors.disable('scrollZoom');
      maps.behaviors.disable('scrollZoom');


    };
    ymaps.ready(init).then(() => this._SetMarker(lat, lng, marker_title, maps));
  }

  private _SetMarker(lat: number, lng: number, title: string = '', instanse) {

    try {
      let _callback = (lat: number, lng: number) => {
        let markertitle = title;
        markertitle.length > settings.max_marker_title_length ? markertitle = markertitle.substring(0, 25) + '...' : false;
        let myPlacemark = new ymaps.Placemark(
          [lat, lng], {
            balloonContent: '',
            iconCaption: markertitle
          }, {
            preset: 'islands#greenDotIconWithCaption'
          }
        );
        // this._ymaps.geoObjects.removeAll();
        instanse.geoObjects.add(myPlacemark);
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
