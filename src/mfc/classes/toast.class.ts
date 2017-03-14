import {Toast } from 'ionic-native';
export class CommonToast {
constructor(){}

  /**
   * Оптправка тостов
   * @param message - сообщение
   * @param delay - длительность показа
   * @param pos - позиция top|center|bottom
   * @constructor
   */
  static ShowToast(message:string, delay = 2000, pos='bottom') {
    try {
      Toast.show(message, delay.toString(), pos).subscribe(
        toast => {
          console.log(toast);
        }
      )
    }
    catch (err) {
      console.error("Произошла ошибка", err)
    }
  }
}
