import {Injectable} from '@angular/core';
import {Push} from 'ionic-native';
import {Platform} from "ionic-angular";
import {CommonToast} from "../helpers/toast.class";
import {common_msg} from "../app/settings/common.msg";
/*
 Generated class for the NotificationProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class NotificationProvider {
  private _push: any = null;

  /**
   *
   * @param plt - платформа на которой запускается приложение
   */
  constructor(private plt: Platform) {

this._Init();
  }


  /**
   * Регистрация пуш уведомлений
   * @returns {Promise<T>}
   * @private
   */
  private _Regiseter() {
    //Проверяем есть ли разрешение на push
    //Если устройство на базе ios или android - пробуем получать токен, при ошибке возвращаем null или ошибку, при успехе - информацию о регистрации
    return new Promise((resolve, reject) => {
      if (this.plt.is('ios') || this.plt.is('android')) {
        try {
          Push.hasPermission().then(() => { //Если на PUSH права есть
            let push = Push.init({
              android: {
                senderID: '995990249907'
              },
              ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
              },
              windows: {}
            });
            try {
              this._push.on('registration', (data) => {
                resolve(push);
              });
            }
            catch (err) {
              reject(null);
              console.error("Произошла ошибка", err)
            }
          }).catch((err) => {
            console.error(err);
            CommonToast.ShowToast(common_msg.push_not_avaiable);
            reject(err)
          })
        }
        catch (err) {
          console.error("Произошла ошибка", err);
          reject(err);
        }
      }
      else {
        reject(null);
        console.error("Произошла ошибка");
      }
    })
  }

  /**
   * Инициализация пушей
   * @private
   */
  private _Init() {

    this.plt.ready().then(() => {
      this._Regiseter().then((res:any) => {
         res.on('notification', () => {
          console.info(res)
        })
      }).catch(err=>{
        CommonToast.ShowToast(common_msg.push_not_avaiable);
        console.error("Произошла ошибка", err);})
    });

  }

  // }


}
