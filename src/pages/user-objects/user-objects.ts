import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { AuthProvider } from '../../providers/auth-provider'
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, CameraPosition, GoogleMapsMarkerOptions, GoogleMapsMarker } from 'ionic-native'

@Component({
  selector: 'page-user-objects',
  templateUrl: 'user-objects.html'
})
export class UserObjectsPage {
  user_object: any = null

  constructor(public navCtrl: NavController, public http: Http, public auth: AuthProvider, public loadingCtrl: LoadingController) { }

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
    this.http.post('http://api.admhmansy.ru/place/plist', body, { headers: headers }).subscribe(res => {
      this.user_object = res.json()
      this.loadMap()
      loader.dismiss()
    }, err => {
      console.log(err.json())
      loader.dismiss()
    })
  }

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
