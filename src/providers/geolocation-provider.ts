import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Geolocation} from 'ionic-native';
import {settings} from "../app/settings/settings";
import NodeGeocoder from "../../node_modules/node-geocoder/index.js"
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
      Geolocation.getCurrentPosition({maximumAge: 3000, timeout: 5000}).then((resp) => {
        resolve({lat: resp.coords.latitude, lng: resp.coords.longitude, default: false});
      }).catch((error) => {
        console.log('Error getting location', error);
        reject({lat: settings.default_lat, lng: settings.default_lng, default: true, error: error});
      });
    });
  }

  public GetReverse(lat, lng) {
    return new Promise((resolve, reject) => {
      var options = {
        provider: 'google',
        httpAdapter: 'https',
        apiKey: 'AIzaSyA0xJ9Fm6xxWy77tUYtUspJCtmjt2pKn3g',
        formatter: null,
        language: 'ru'
      };
      var geocoder = NodeGeocoder(options);
      geocoder.reverse({lat: lat, lon: lng})
        .then((res: any) => {
        console.info(res[0])
          resolve(res[0]);
        })
        .catch((err) => {
          reject(err);
        });
    })
  }

}
