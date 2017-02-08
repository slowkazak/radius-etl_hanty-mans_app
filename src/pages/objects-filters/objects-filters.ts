import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Filter } from '../../models/filters'

/*
  Generated class for the ObjectsFilters page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-objects-filters',
  templateUrl: 'objects-filters.html'
})
export class ObjectsFiltersPage {
  filter: Object
  num: any
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, boo: Filter) {
    this.filter = boo
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

  ionViewDidLoad() {
    console.log('Hello ObjectsFiltersPage Page');
  }

}
