import {Injectable} from '@angular/core';
import {Platform} from "ionic-angular";
import {Events} from 'ionic-angular';
import {Http, URLSearchParams, Headers} from '@angular/http';

import {settings} from "../app/settings/settings";
import {CommonCallback} from "../helpers/common.callback.class";
import "rxjs/add/operator/toPromise";
import {AuthProvider} from "./auth-provider";
import _ from "lodash";

/*
 Generated class for the NotificationProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class PointsProvider {
  private _headers = new Headers()

  /**
   *
   * @param plt - платформа на которой запускается приложение
   */
  constructor(private http: Http, private events: Events, private auth: AuthProvider) {
    this._headers.set('Content-Type', 'application/x-www-form-urlencoded');
    this._Init();
  }


  /**
   * Инициализация
   * @private
   */
  private _Init() {
    // async _f = ()=>{}
    this.events.subscribe('points:change', () => {
      this._GetPoints().then((res) => {
        _.has(res, "points") && !isNaN(res.points) && res.points >= 0 ? (this.auth.SetPoints(res.points)) : false;
        console.info(res)
      }).catch(err => {
        console.error(err)
      })
    });
  }


  /**
   * Получает колисество баллов пользователя
   * @param token
   * @constructor
   */
  private _GetPoints() {
    let result: any = null;
    try {
      let token = this.auth.Get().user.access_token;
      let urlsearch = new URLSearchParams();
      token && token.length > 0 ? urlsearch.set(settings.api_methods.user_info.auth_param, token) : result = Promise.reject(null);
      ;
      result = this.http.post(settings[settings.api_methods.user_info.domain] + settings.api_methods.user_info.method,
        urlsearch.toString(), {headers: this._headers})
        .toPromise().then(res => CommonCallback._SuccessCallback(res))
        .catch(err => CommonCallback._ErrorCallback(err))
    }
    catch (err) {
      result = Promise.reject(err);
      console.error(err);
    }
    return result;
  }

}
