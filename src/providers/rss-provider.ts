import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import "rxjs/add/operator/toPromise";
import _ from "lodash";
import {settings} from "../app/settings/settings";
import {NewsFeed} from "../app/interfaces/newsfeed.interface";
/*
 Generated class for the RssProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class RssProvider {

  constructor(public http: Http) {
    console.log('Hello RssProvider Provider');
  }

  /**
   * Преобразование загруженной ленты в массив объектов
   * @returns {Promise<T>}
   * @constructor
   */
  LoadRss() {
    return new Promise((resolve, reject) => {

      try {

        let _callback = (items) => {
          let parser = new DOMParser();
          let xmlDoc = null;
          xmlDoc = parser.parseFromString(items, "text/xml");
          xmlDoc = xmlDoc.getElementsByTagName("item");
          let news_array:Array<NewsFeed> = [];

          _.map(xmlDoc, (item: any) => {
            try {
              news_array.push(
                {
                  title: item.getElementsByTagName("title")[0].innerHTML,
                  description: item.getElementsByTagName("description")[0].innerHTML,
                  link: item.getElementsByTagName("link")[0].innerHTML,
                  enclosure: item.getElementsByTagName("enclosure")[0].getAttribute("url"),
                  pubDate: item.getElementsByTagName("pubDate")[0].innerHTML
                }
              )
            }
            catch (err) {
              console.error(err)
            }
          });
          return news_array;
        };

        this._GetRss().then(res => {
          let result = _callback(res);
          resolve(result);
        }).catch(err => {
          reject(null);
        })

      }
      catch (err) {
        console.error(err)
        reject(null);
      }

    })
  }

  /**
   * Загрузка rss ленты
   * @returns {Promise<void|T>}
   * @private
   */
  private _GetRss() {
    return this.http.get(settings.adm_domain_path + "/news/rss/").toPromise().then((res: any) => this._SucccessCallback(res)).catch(err => console.error(err))
  }

  private _SucccessCallback(res) {
    console
    return res._body;
  }

}
