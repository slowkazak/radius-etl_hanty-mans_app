import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Filter } from '../../models/filters'

/*
  Generated class for the ObjectsStatus page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-objects-status',
  templateUrl: 'objects-status.html'
})
export class ObjectsStatusPage {
  filter: Object
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private boo: Filter) {
    // this.filter = boo
  }

  ionViewDidLoad() {

  }

  dismiss() {
this.boo.Set();
    this.viewCtrl.dismiss()
  }

}
