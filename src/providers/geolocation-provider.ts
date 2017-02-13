import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Geolocation} from 'ionic-native';
import {settings} from "../app/settings/settings"
/*
 Generated class for the GeolocationProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class GeolocationProvider {

  constructor() {
  }

  /**
   * Получение координат пользователя
   * @returns {Promise<T>}
   * @constructor
   */
  public GetLocation() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
        resolve({lat: resp.coords.latitude, lng: resp.coords.longitude, default: false});
      }).catch((error) => {
        console.log('Error getting location', error);
        reject({lat: settings.default_lat, lng: settings.default_lng, default: true, error: error});
      });
    });
  }

}
