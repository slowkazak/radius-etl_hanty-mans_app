import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {LengProvider} from "../../providers/leng-provider";
import _ from "lodash";
/*
 Generated class for the NewsPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-news-page',
  templateUrl: 'news-page.html'
})
export class NewsPagePage {
  private _leng: any = {};
  private _item: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private leng: LengProvider) {
  }

  ionViewDidLoad() {
    this.leng.GetLeng("news_page").then(res => {
      this._leng = _.assign({}, res);
    }).catch(err => {
      this._leng = _.assign({}, err);
    });
    this._item = _.assign({}, this.navParams.get('item'))
  }

}
