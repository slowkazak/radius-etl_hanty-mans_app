import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage'
import {Http, URLSearchParams, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider {
  server: string = 'http://api.admhmansy.ru'
  user: any = {}
  islogged: boolean = false;

  constructor(public http: Http, public storage: Storage) {
    console.log('Hello AuthProvider Provider');
  }

  signIn(login: string, password: string) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let params = new URLSearchParams()
    params.set('login', login)
    params.set('password', password)
    let body = params.toString()
    return this.http.post(this.server + "/user/auth", body, {headers: headers})
  }

  signUp(login: string, first_name: string, second_name: string, password: string) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let params = new URLSearchParams()
    params.set('login', login)
    params.set('first_name', first_name)
    params.set('second_name', second_name)
    params.set('password', password)
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

  addPoints(points: number) {
    // TODO, но по-хорошему надо на стороне сервера
  }

  updateStorage() {
    this.storage.set('user', JSON.stringify(this.user))
  }

  clearStorage() {
    this.user = {}
    this.storage.clear()
  }

}
