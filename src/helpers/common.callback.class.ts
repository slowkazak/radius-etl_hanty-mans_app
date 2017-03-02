import {common_msg} from "../app/settings/common.msg";
export class CommonCallback {
  constructor() {
  }

  /**
   * Коллбэк для успешного выполнения запроса
   * @param data
   * @returns {any}
   * @public
   */
  static _SuccessCallback(data) {
    return data.json()
  }

  /**
   * Коллбэк для ошибки
   * @param data
   * @returns {null}
   * @public
   */
  static _ErrorCallback(data) {
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
