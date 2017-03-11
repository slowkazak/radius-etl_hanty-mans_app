import {Component} from '@angular/core';
import {RssProvider} from "../../providers/rss-provider";
import _ from "lodash";
import {LengProvider} from "../../providers/leng-provider";
import {NewsFeed} from "../../app/interfaces/newsfeed.interface";
import {NavController, ViewController} from "ionic-angular";
import {SafariViewController, InAppBrowser} from "ionic-native";

/*
 Generated class for the NewsFeed page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-news-feed',
  templateUrl: 'news-feed.html',
  providers: [RssProvider]
})

export class NewsFeedPage {
  private _leng: any = {};
  private _news: Array<NewsFeed> = [];
  private _error: boolean = false;
  private _nomessagetext: string = '';

  constructor(private leng: LengProvider, private rss: RssProvider) {
  }


  ngAfterViewInit() {
    this.leng.GetLeng("news_feed").then(res => {
      this._leng = _.assign({}, res);
    }).catch(err => {
      this._leng = _.assign({}, err);
    });
    this._LoadRss();
  }

  /**
   * При запуске эта функция должна быть запущена чтобы показать ленту новостей
   * @private
   */
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


  doRefresh(refresher) {
    this._LoadRss();
    // refresher.complete();
  }


  /**
   * Открытие страницы новости в окне браузера
   * @param item
   * @constructor
   */
  OpenPage(item) {
    console.info(item.link)
    try {
      SafariViewController.isAvailable()
        .then(
          (available: boolean) => {
            if (available) {

              SafariViewController.show({
                url: item.link,
                hidden: false,
                animated: false,
                transition: 'curl',
                enterReaderModeIfAvailable: true,
                tintColor: '#ff0000'
              })
                .then(
                  (result: any) => {
                  },
                  (error: any) => console.error(error)
                );

            } else {
              let browser = new InAppBrowser(item.link, '_system');
            }
          }
        );
    }
    catch (err) {
      console.error("Произошла ошибка", err)
    }

  }

}
