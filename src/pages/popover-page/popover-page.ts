import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import _ from "lodash";
import {LengProvider} from "../../providers/leng-provider";
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

  private data: any = {docs: [], time: null, date: null};
  private _leng: any = {};

  constructor(public viewCtrl: ViewController, public navParams: NavParams, private leng: LengProvider) {
  }

  ionViewDidLoad() {
    this.leng.GetLeng("docs").then(res => {
      this._leng = _.assign({}, res);
    }).catch(err => {
      this._leng = _.assign({}, err);
    });
    this._Init()
  }

  private _Init() {
    try {
      this.data.docs.push(...this.navParams.get("docs"));
      this.data.date = this.navParams.get("date");
      this.data.time = this.navParams.get("time");
      this.data.title = this.navParams.get("title");
    }
    catch (err) {
    }
  }
  private _Close()
  {
    this.viewCtrl.dismiss();
  }

}
