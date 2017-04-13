import {Injectable} from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {CommonCallback} from "../classes/common.callback.class";
import {CacherClass} from '../classes/cacher/cacher.class';
import  _ from  "lodash";
/*
 Generated class for the Mfc provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class MfcProvider {

  private _mfcserver: string = 'http://online.mfchmao.ru/enter/';
  token: any = null;
  _cacher: CacherClass = new CacherClass();
  constructor(public http: Http, private callback: CommonCallback) {

  }

  public TryLogin(email = null, password = null) {
    return new Promise((resolve, reject) => {
      this.Login(email, password).then(res => {
        _.isObject(res) ? reject("Неправильный логин или пароль") : (
            this.token = res,
              resolve(true)
          );
      }).catch(err => {
        reject("Ошибка связи с сервером");
        console.error(err)
      })
    })
  }

  public TryBook(data) {
    return new Promise((resolve, reject) => {
      this.Book(data).then(res => {
        try {
          _.has(res, 'FullNumber') && _.has(res, 'Products')? resolve(res) : reject(null);
        }
        catch (err) {
          reject(null);
          console.error("Произошла ошибка", err)
        }
      }).catch(err => {
        console.error(err);
        reject("Ошибка связи с сервером");
      })
    })
  }

  /**
   * Авторизация на сервисе мфц
   * @param email
   * @param password
   * @returns {any}
   * @constructor
   */
  private Login(email = null, password = null) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded')
    let login = '';
    let pass = '';
    !email && !password ?
      (    login = 'iljas@radius-etl.ru',
          pass = 'test100'
      ) :
      (    login = email,
          pass = password
      );

    let result: any = null;
    try {
      let urlsearch = new URLSearchParams();
      urlsearch.append('login', login);
      urlsearch.append('password', pass);
      result = this.http.post(this._mfcserver + 'login', urlsearch.toString(), {headers: headers})
        .toPromise()
        .then(res => this.callback._SuccessCallback(res))
        .catch(err => this.callback._ErrorCallback(err))
    }
    catch (err) {
      result = Promise.reject(null);
      console.error("Произошла ошибка", err)
    }
    return result;
  }

  /**
   * Запись на мфц
   * @param data
   * @returns {any}
   * @constructor
   */


  private Book(data) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    this.token ? headers.set('Authorization', this.token) : false;
    console.info(this.token)
    let result: any = null;
    try {
      let urlsearch = new URLSearchParams();
      let dataFields = JSON.stringify([{ProductRequiredFieldTypeId: data.reqid, Value: data.second_name}])
      urlsearch.set('menuLinkId', data.id);
      urlsearch.set('date', data.date);
      urlsearch.set('time', data.time);
      urlsearch.set('dataFields', dataFields);
      urlsearch.set('confirm', 'true');
      result = this.http.post(this._mfcserver + 'book', urlsearch.toString(), {headers: headers})
        .toPromise()
        .then(res => this.callback._SuccessCallback(res))
        .catch(err => this.callback._ErrorCallback(err))
    }
    catch (err) {
      result = Promise.reject(null);
      console.error("Произошла ошибка", err)
    }
    return result;
  }

  /**
   * Получение списка услуг МФЦ
   * @returns {any} http://online.mfchmao.ru/enter/schedule/days?productId=32aff797-8559-433f-a190-4e32530dd3a8
   * @constructor
   */

  public GetServices(forse = false): Promise<any> {
    let result: any = null;
    let rnd = Math.floor(Math.random() * 6) + 1;

    let _callback = (f = false) => {
      try {
        result = this.http.get(this._mfcserver + 'menu')
          .toPromise()
          .then(res => this.callback._SuccessCallback(res, f))
          .catch(err => this.callback._ErrorCallback(err))
      }
      catch (err) {
        result = Promise.resolve(this.callback._SuccessCallback());
        console.error("Произошла ошибка", err)
      }
    };
    rnd !== 5 && this._cacher.GetCache('data') ? result = Promise.resolve(this.callback._SuccessCallback()) : _callback();
    if (forse) {
      _callback(true);
    }


    return result;
  }

  /**
   * Запрашивает список дней, доступных для записи
    * @param productId - айдишник услуги
   * @returns {Promise} -
   * @constructor
   */
  public GetDays(productId: string): Promise<any> {
    let result: any = null;
    try {
      let urlsearch = new URLSearchParams();
      urlsearch.append('menuLinkId', productId)
      result = this.http.get(this._mfcserver + 'schedule/days', {search: urlsearch})
        .toPromise()
        .then(res => this.callback._SuccessCallback(res))
        .catch(err => this.callback._ErrorCallback(err))
    }
    catch (err) {
      result = Promise.reject(null);
      console.error("Произошла ошибка", err)
    }
    return result;
  }

  /**
   * Запрашивает список часов доступных для записи
   * @param date
   * @param productId
   * @returns {any}
   * @constructor
   */
  public GetHours(date: any, productId) {
    let result: any = null;
    try {
      let urlsearch = new URLSearchParams();
      urlsearch.set('menuLinkId', productId);
      urlsearch.set('date', date);
      result = this.http.get(this._mfcserver + 'schedule/days', {search: urlsearch})
        .toPromise()
        .then(res => this.callback._SuccessCallback(res))
        .catch(err => this.callback._ErrorCallback(err))
    }
    catch (err) {
      result = Promise.reject(null);
      console.error("Произошла ошибка", err)
    }
    return result;
  }
}
