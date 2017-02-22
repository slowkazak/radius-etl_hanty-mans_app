import {Injectable} from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {settings} from "../app/settings/settings";
import {common_msg} from "../app/settings/common.msg";
import _ from "lodash";
/*
 Generated class for the UserUpdateProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class UserUpdateProvider {
  private _headers = new Headers();

  constructor(public http: Http) {
    console.log('Hello UserUpdateProvider Provider');
  }

  /**
   * Редактирование пользователя, отправка паспортных данных а также пуш токена
   * /user/update?data={"passport_data":"md5", "push_token": "push_token"}&user_id=1
   * @param id
   * @param passport
   * @param push_token
   * @param token
   * @constructor
   */
  public UserUpdate(id?, passport_data = null, push_token = null, token = null) {

    this._headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let urlsearch = new URLSearchParams();
    let data: any = {};
    let result: any = null;
    passport_data ? data.passport_data = passport_data : false;
    push_token ? data.push_token = push_token : false;

    !_.isEmpty(data) ? (
        urlsearch.append(settings.api_methods.user_update.data_param, JSON.stringify(data)),
          urlsearch.append(settings.api_methods.user_update.auth_param, id),
          console.log(settings.adm_api_path + settings.api_methods.user_update.method, urlsearch.toString(), this._headers),
      result = this.http.post(settings.adm_api_path + settings.api_methods.user_update.method, urlsearch, this._headers).toPromise().then(res => this._SuccessCallback(res)).catch(err => this._ErrorCallback(err))
  )
  :
    result = Promise.reject(null);
    return result;
  }

  /**
   * Коллбэк для успешного выполнения запроса
   * @param data
   * @returns {any}
   * @private
   */
  private _SuccessCallback(data) {
    return data.json()
  }

  /**
   * Коллбэк для ошибки
   * @param data
   * @returns {null}
   * @private
   */
  private _ErrorCallback(data) {
    console.error(common_msg.query_execute_err, data);
    let result = null;
    try {
      switch (data.status) {
        case 0:
          result = 0;
          break;
        case 404:
          result = 404;
          break;
        case 500:
          result = 500;
          break;
      }
    }
    catch (err) {
      console.error(common_msg.query_execute_err, err);
    }
    return result;
  }


}
