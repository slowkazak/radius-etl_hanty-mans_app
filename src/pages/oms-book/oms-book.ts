import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Omsbook page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-omsbook',
  templateUrl: 'oms-book.html'
})
export class OmsBookPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello OmsbookPage Page');
  }

}
