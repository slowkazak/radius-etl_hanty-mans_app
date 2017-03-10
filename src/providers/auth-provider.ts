import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage'
import {Http, URLSearchParams, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Subject} from "rxjs";
import _ from "lodash";
import {CommonCallback} from "../helpers/common.callback.class";
import {settings} from "../app/settings/settings";
@Injectable()
export class AuthProvider {
  server: string = 'http://api.admhmansy.ru'
  user: any = {}
  islogged: boolean = false;
  private _headers: any = null;

  constructor(public http: Http, public storage: Storage) {
    this._Init();
  }


  private _Init() {

    this._headers = new Headers();
    this._headers.set('Content-Type', 'application/x-www-form-urlencoded');
  }

  public Auth(login: string, password: string) {
    let result: any = null;
    let urlsearch = new URLSearchParams();
    urlsearch.append(settings.api_methods.user_login.data_param[0], login);
    urlsearch.append(settings.api_methods.user_login.data_param[1], password);
    try {
      result = this.http.post(settings[settings.api_methods.user_login.domain] + settings.api_methods.user_login.method, urlsearch.toString(), {headers: this._headers})
        .toPromise()
        .then(res => CommonCallback._SuccessCallback(res))
        .catch(err => CommonCallback._ErrorCallback(err));
    }
    catch (err) {
      result = Promise.reject(null);
      console.error("Произошла ошибка", err)
    }
    return result;
  }

  public Rerister(login: string, first_name: string, second_name: string, password: string, phone: string, email: string) {
    let result: any = null;
    let urlsearch = new URLSearchParams();
    // 'login','first_name','second_name','password','phone','email'
    urlsearch.append(settings.api_methods.user_register.data_param[0], login);
    urlsearch.append(settings.api_methods.user_register.data_param[1], first_name);
    urlsearch.append(settings.api_methods.user_register.data_param[2], second_name);
    urlsearch.append(settings.api_methods.user_register.data_param[3], password);
    urlsearch.append(settings.api_methods.user_register.data_param[4], phone);
    urlsearch.append(settings.api_methods.user_register.data_param[5], email);
    try {
      result = this.http.post(settings[settings.api_methods.user_register.domain] + settings.api_methods.user_register.method, urlsearch.toString(), {headers: this._headers})
        .toPromise()
        .then(res => CommonCallback._SuccessCallback(res))
        .catch(err => CommonCallback._ErrorCallback(err));
    }
    catch (err) {
      result = Promise.reject(null);
      console.error("Произошла ошибка", err)
    }
    return result;
  }

  public SayPushToken(platform = 'android', push_token = '', uid = 0, token = '') {


    let result: any = null;
    let data = {"platform": platform, "push_token": push_token};
    try {
      let urlsearch = new URLSearchParams();
      let interval = setInterval(() => {
        let usr = this.Get();
        _.has(usr, "access_token") && _.has(usr, "ID") ?
          (
            clearInterval(interval),
              urlsearch.append('user_id', usr.ID),
              urlsearch.append('access_token', usr.access_token),
              urlsearch.append('data', JSON.stringify(data)),
              result = this.http.post(settings[settings.api_methods.user_update2.domain] +
                settings.api_methods.user_update2.method, urlsearch.toString(),
                {headers: this._headers})
                .toPromise()
                .then(res => CommonCallback._SuccessCallback(res))
                .catch(err => CommonCallback._ErrorCallback(err))
          )
          :
          false
      }, 2000);


    }
    catch (err) {
      result = Promise.reject(null)
      console.error("Произошла ошибка", err)
    }
    return result;
  }

  //TODO рефактор
  signIn(login: string, password: string) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let params = new URLSearchParams()
    params.set('login', login)
    params.set('password', password)
    let body = params.toString()
    return this.http.post(this.server + "/user/auth", body, {headers: headers})
  }

  signUp(login: string, first_name: string, second_name: string, password: string, phone: string, email: string) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let params = new URLSearchParams()
    params.set('login', login)
    params.set('first_name', first_name)
    params.set('second_name', second_name)
    params.set('password', password)
    params.set('phone', phone)
    params.set('email', email)
    let body = params.toString()
    return this.http.post(this.server + "/user/create", body, {headers: headers})
  }

  checkAuth() {
    return this.storage.get('user')
  }

  /**
   * Запрос объекта пользователя
   * @returns {any|null}
   * @constructor
   */
  public Get() {
    return this.user || null;
  }

  set(key: string, param: any) {
    try {
      this.user[key] = param;
      this.updateStorage()
    }
    catch (err) {
      console.error("Произошла ошибка", err)
    }
  }

  /**
   * Изменяет количество баллов пользователя
   * @param points - количество баллов
   * @constructor
   */
  public SetPoints(points: number) {
    this.set('points', points);
    this.user = this.Get();
    this.updateStorage();
  }

  updateStorage() {
    // this.usersubject.next(this.user.token);
    this.storage.set('user', JSON.stringify(this.user))
  }

  clearStorage() {
    this.user = {}
    this.storage.clear()
  }

}
