import {Component} from '@angular/core';
import {NavController, ViewController, NavParams} from 'ionic-angular';
import {ObjectsService} from '../../providers/objects-service'
import {location} from '../../models/location'
import {GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, CameraPosition} from 'ionic-native'
import {GeolocationProvider} from "../../providers/geolocation-provider";
import {LocationData} from "../../app/interfaces/location.interface";

@Component({
  selector: 'page-location-select',
  templateUrl: 'location-select.html',
  providers: [ObjectsService]
})
export class LocationSelectPage {

  private _ymaps: any = null;
  public _marker_placeable: boolean = true;

  map: any

  constructor(private locationprov: GeolocationProvider,
              public navCtrl: NavController, private service: ObjectsService, private viewCtrl: ViewController, private navParams: NavParams, public location: location) {
  }

  ionViewDidLoad() {
    console.log('Hello LocationSelectPage Page');
    this.locationprov.GetLocation()
      .then((res: LocationData) => this._InitMap(res.lat, res.lng))
      .catch((err: LocationData) => this._InitMap(err.lat, err.lng));
    // this.loadMap()
  }


  /**
   * Инициализация карты с привязанной геолокацией
   * @param lat
   * @param lng
   * @private
   */

  private _InitMap(lat: number, lng: number) {
    let init = () => {
      "use strict";
      this._ymaps = new ymaps.Map("map", {
        center: [lat, lng],
        zoom: 13,
        controls: []
      });

      this._ymaps.events.add('click', (e) => {
        this._marker_placeable ? this._SetMarker(e) : false
      });
    };
    ymaps.ready(init);
  }

  /**
   * Установка маркера
   * @param ev
   * @param title
   * @private
   */

  private _SetMarker(ev: any, title:string='') {
    let coords = [];
    try {
      let _callback = (lat: number, lng: number) => {
        let myPlacemark = new ymaps.Placemark(
          [lat, lat], {iconContent: title}
        );
        this._ymaps.geoObjects.add(myPlacemark);
      };
      coords.push(...ev.get('coords'));
      _callback(coords[0], coords[1]);
    }
    catch (err) {
      console.info("Невозможно установить метку", err);
    }
  }











  //TODO рефакатор, затем удалить

  loadMap() {
    let element: HTMLElement = document.getElementById('map')
    this.map = new GoogleMap(element)
    let map = this.map

    map.one(GoogleMapsEvent.MAP_READY).then(() => {
      console.log('Map is ready!')
      let pos: GoogleMapsLatLng

      if (this.location.get()) {
        console.log('location found')
        pos = new GoogleMapsLatLng(this.location.get()[0], this.location.get()[1])
      } else {
        console.log('location not found')
        pos = new GoogleMapsLatLng(61.008038, 69.035848)
      }

      let position: CameraPosition = {
        target: pos,
        zoom: 13
      }

      map.moveCamera(position)
    })

    map.one(GoogleMapsEvent.CAMERA_CHANGE).then((res) => {
      map.getCameraPosition().then(camera => {
        console.log(camera)
      }, err => {
        console.log(err)
      })
    })
  }

  selectPoint() {
    let map = this.map
    map.getCameraPosition().then(camera => {
      this.location.set(camera.target.lat, camera.target.lng)
      console.log(this.location.get())
      this.navCtrl.pop()
    }, err => {

    })
  }

}
