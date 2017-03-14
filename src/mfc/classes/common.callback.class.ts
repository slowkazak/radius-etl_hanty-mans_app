import {CacherClass} from "./cacher/cacher.class";
export class CommonCallback {
  _cacher:CacherClass=new CacherClass();

  constructor() {

  }

  /**
   * Коллбэк для успешного выполнения запроса
   * @param data
   * @returns {any}
   * @public
   */
  _SuccessCallback(data=null, forse = false) {
    let cache:any = this._cacher.GetCache('data');
    let res:any = null;
    if (data) {
      res = data.json();
      this._cacher.SetCache('data', data.json());
      try {
        !forse ?
          cache ? res = JSON.parse(cache) : false
          : false;
      }
      catch (err) {
        console.error("Произошла ошибка", err)
      }
    }
    else  {
      cache ? res = JSON.parse(cache) : false
    }
    return res;
  }

  /**
   * Коллбэк для ошибки
   * @param data
   * @returns {null}
   * @public
   */
  _ErrorCallback(data) {
    console.error("Произошла ошибка", data);
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
      console.error("Произошла ошибка", err);
    }
    return {result:result, body:data._body};
  }
}
