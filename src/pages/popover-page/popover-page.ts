import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

/*
  Generated class for the PopoverPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-popover-page',
  templateUrl: 'popover-page.html'
})
export class PopoverPage {
private seq:any = null;
private data:any = null;
  constructor( public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
     this._Init()
  }
  private _Init() {
    try {
      console.log(this.navParams.data,"DATA PARAMS");
    }
    catch (err){

    }
  }

}
