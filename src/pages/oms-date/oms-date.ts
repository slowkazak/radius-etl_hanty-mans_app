import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {OmsProvider} from "../../providers/oms-provider";
import _ from "lodash";
import {OmsDateInterface} from "../../app/interfaces/oms.date.interface";
import {OmsTimePage} from "../oms-time/oms-time";
/*
 Generated class for the OmsDate page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-oms-date',
  templateUrl: 'oms-date.html',
  providers: [OmsProvider]
})
export class OmsDatePage {
  private _hasdates: boolean = false;
  private _is_loaded: boolean = false;
  private _data: any = [];
  private serviceId: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public oms: OmsProvider, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: 'Загрузка...'
    });
    loader.present();
    this._GetDateOMS().then((res: boolean) => {
      loader.dismiss();
      this._is_loaded = res;
      loader.dismiss();
    }).catch((err: boolean) => {
      loader.dismiss();
      this._is_loaded = err
    });
  }


  private _GetDateOMS() {

    return new Promise((resolve, reject) => {
      try {
        this.oms.GetTime(this.navParams.data.item.id).then(res => {
          res && _.has(res, "length") ? _.forEach(res, (item) => {
                _.has(item, "time") && _.has(item.time, "length") && item.time.length > 0 ?
                  (() => {
                    try {
                      let splitted_date = null;
                      if (this._data.length === 0) {
                        splitted_date = item.date.split('.');
                        this._data.push(
                          {
                            year: splitted_date[2],
                            month: splitted_date[1],
                            date: item.date,
                            visitLength: item.visitLength,
                            day: [{
                              day: splitted_date[0],
                              time: item.time
                            }]
                          }
                        );
                      } else {
                        splitted_date = item.date.split('.');
                        let arr = _.filter(this._data, _.matches({
                          'year': splitted_date[2].toString(),
                          'month': splitted_date[1].toString()
                        }));
                        arr.length > 0
                          ?
                          arr[0].day.push(
                            {
                              day: splitted_date[0],
                              time: item.time
                            }
                          )
                          :
                          this._data.push(
                            {
                              year: splitted_date[2],
                              month: splitted_date[1],
                              date: item.date,
                              visitLength: item.visitLength,
                              day: [{
                                day: splitted_date[0],
                                time: item.time
                              }]
                            }
                          );

                      }

                    }
                    catch (err) {
                      console.error("Произошла ошибка", err)
                    }


                  })() : false;
              }
            ) : false;
          this._hasdates ? resolve(true) : resolve(false);

        }).catch(err => {
          reject(true);
          console.error("Произошла ошибка", err);
        })


      }
      catch (err) {
        this._hasdates = false;
        reject(true);
        console.error("Произошла ошибка", err);
      }
    })
  }

  private GetTimeOMS(time, title, visitLength) {
    this.navCtrl.push(OmsTimePage, {
      name: title,
      time: time,
      visitLength: visitLength,
      serviceId: this.navParams.data.item.id
    })
  }
}
