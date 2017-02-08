import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { ObjectsService } from '../../providers/objects-service'
import { location } from '../../models/location'
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, CameraPosition } from 'ionic-native'

@Component({
  selector: 'page-location-select',
  templateUrl: 'location-select.html',
  providers: [ObjectsService]
})
export class LocationSelectPage {
  map: any
  constructor(public navCtrl: NavController, private service: ObjectsService, private viewCtrl: ViewController, private navParams: NavParams, public location: location) {}

  ionViewDidLoad() {
    console.log('Hello LocationSelectPage Page');
    this.loadMap()
  }

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
