import {Injectable} from '@angular/core';
import {Push} from 'ionic-native';
import {Platform, Events} from "ionic-angular";
import {CommonToast} from "../helpers/toast.class";
import {common_msg} from "../app/settings/common.msg";
import {AuthProvider} from "./auth-provider";
import {PishStorage} from "../models/push";
import _ from "lodash";
/*
 Generated class for the NotificationProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class NotificationProvider {
  platform = '';

  /**
   *
   * @param plt - платформа на которой запускается приложение
   */
  constructor(private plt: Platform, private auth: AuthProvider,private events:Events) {

    // this._Regiseter();
  }






  /**
   * Регистрация пуш уведомлений
   * @returns {Promise<T>}
   * @private
   */
  public _Regiseter(sender_id = 995990249907) {

    //Проверяем есть ли разрешение на push
    //Если устройство на базе ios или android - пробуем получать токен, при ошибке возвращаем null или ошибку, при успехе - информацию о регистрации

      let interval:any=null;
      this. ChangeToken();
      if (this.plt.is('ios') || this.plt.is('android')) {

        this.plt.is('ios') ? this.platform = 'ios' : this.platform = 'android';
        try {

          Push.hasPermission().then(() => { //Если на PUSH права есть
            console.info(3)
            // clearInterval(interval);
            let push = Push.init({
              android: {
                sound: true,
                vibrate: true,
                forceShow: false,
                senderID: sender_id.toString()
              },
              ios: {
                alert: true,
                badge: true,
                sound: true,
                senderID: sender_id.toString(),
                gcmSandbox: true
              }
            });

            push.on('registration', (data) => {
              console.info(data);
              PishStorage.token.next(data.registrationId);
            });
            push.on('notification', (res) => {
              this.events.publish('points:change');
              this.events.publish('message:new',{msg:res.message,type:null});
              console.info(res);
              res.additionalData.foreground?
              CommonToast.ShowToast(res.message):false

            });
            push.on('error', (e) => {
              CommonToast.ShowToast(common_msg.push_not_avaiable);
              console.log(e.message);
            });

          }).catch((err) => {
            interval = setInterval(this._Regiseter(),5000);
            console.error(err);
            CommonToast.ShowToast(common_msg.push_not_avaiable);

          })
        }
        catch (err) {
          CommonToast.ShowToast(common_msg.push_not_avaiable);
          console.error("Произошла ошибка111", err);

        }
      }
      else {
        CommonToast.ShowToast(common_msg.push_not_avaiable);
        console.error("Произошла ошибка");
      }


  }

  /**
   * Инициализация пушей
   * @private
   */
  private ChangeToken() {
    PishStorage.token.subscribe(
      (x) => {
        this.auth.SayPushToken(this.platform, x);

      },
      (e) => {
        console.log('onError: ' + e.message);
      },
      () => {
        console.log('onCompleted');
      });
  }

}
