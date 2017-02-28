import {Component, OnInit} from '@angular/core';
import {RssProvider} from "../../providers/rss-provider";
import {NewsFeed} from "../../app/interfaces/newsfeed.interface";
import {LengProvider} from "../../providers/leng-provider";
import _ from "lodash";
/*
  Generated class for the NewsSlider component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'news-slider',
  templateUrl: 'news-slider.html',
  providers:[RssProvider,LengProvider]
})
export class NewsSliderComponent implements OnInit{
  private _news: Array<NewsFeed> = [];
  private _leng:any = {};
  private _error: boolean = false;
  private _nomessagetext: string = '';


  text: string;

  constructor(private rss: RssProvider , private leng: LengProvider) {
    console.log('Hello NewsSlider Component');
    this.text = 'Hello World';
  }
  ngOnInit(){
    this.leng.GetLeng("news_feed").then(res => {
      this._leng = _.assign({}, res);
    }).catch(err => {
      this._leng = _.assign({}, err);
    });
    this._LoadRss();
  }
  private _LoadRss() {
    this.rss.LoadRss().then((res: Array<NewsFeed>) => {
      this._error = false;
      res ? (this._news = [], this._news.push(...res)) :
        this._nomessagetext = this._leng.news_empty;
    }).catch(err => {
      console.error(err);
      this._error = true;
      this._error = this._leng.news_load_err;
    })
  }
}
