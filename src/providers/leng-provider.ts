import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {leng} from "../app/settings/leng.ru";
import {common_msg} from "../app/settings/common.msg";
import _ from "lodash";
import "rxjs/add/operator/toPromise";

/*
 Generated class for the LengProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class LengProvider {

  constructor(public http: Http) {

  }

  /**
   * Получение необходимой страницы локали
   * @param page - страница из которой грузить локаль
   * @returns {Promise<T>}
   * @constructor
   */
  public GetLeng(page = null) {
    return new Promise((resolve, reject) => {
      this.InitLeng().then((res: any) => {
        page && _.has(res.leng, page) ? resolve(res.leng[page]) : resolve(leng.leng);

      }).catch(err => {
        page && _.has(err.leng, page) ? reject(err.leng[page]) : reject(leng.leng);
      })
    })


  }

  /**
   * Инициализация языкового пакета
   * @param leng
   * @constructor
   */
  private InitLeng(_leng = "ru") {
    let result = null;
    try {

      result = this.http.get('assets/leng/leng.ru.json').toPromise()
        .then(res => this._SuccessCallback(res))
        .catch(err => this._ErrorCallback(err));
    }
    catch (err) {
      console.error(err, common_msg.leng_load_crit_err);
      result = Promise.reject(leng);

    }
    return result;
  }

  private _SuccessCallback(data: any) {
    let result = null;
    try {
      result = data.json();
    }
    catch (err) {
      console.error("Невозможно загрузить локаль, используется локаль по умолчанию");
      result = leng;
    }
    return result;
  }

  private _ErrorCallback(err) {
    console.error("Невозможно загрузить локаль, используется локаль по умолчанию", err);
    return leng
  }

}
