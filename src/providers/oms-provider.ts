import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import {AuthProvider} from './auth-provider'


import {common_msg} from "../app/settings/common.msg";
import {LengProvider} from "./leng-provider";
import _ from "lodash";
import "rxjs/add/operator/toPromise";


//todo рефактор, затем удалить
@Injectable()
export class OmsProvider {
  services: Array<Object>
  server: String = 'http://217.115.185.188:6449/';


  private _headers = new Headers();
  private _leng: any = {};

  constructor(private lengprovider: LengProvider,
              public http: Http, private auth: AuthProvider) {
    this._Init();
    this.services = [
      {
        id: 1,
        name: 'Администрация города'
      },
      {
        id: 2,
        name: 'Департамент муниципальной собственности'
      },
      {
        id: 3,
        name: 'Департамент городскогро хозяйства'
      },
      {
        id: 4,
        name: 'Департамент градостроительства и архитектуры'
      },
      {
        id: 5,
        name: 'Департамент образования'
      }
    ]
  }

  /**
   * Инициализация провайдера
   * @private
   */
  private _Init() {
    this._headers.set('Content-Type', 'application/x-www-form-urlencoded');
    this.lengprovider.GetLeng("http_queries").then(res => {
      this._leng = _.assign({}, res);
    }).catch(err => {
      this._leng = _.assign({}, err);
    });
  }

  public GetDocuments(serviceId: any) {
    let result = null;
    try {
      result = this.http.get(this.server + "index.php/controller_index/serviceContentJSON?serviceId=" + serviceId)
        .toPromise()
        .then(res => this._SuccessCallback(res))
        .catch(err => this._ErrorCallback(err))
    }
    catch (err) {
      console.error("Произошла ошибка", err);
      result = Promise.reject(null);
    }
    return result;
  }
  public Book(item: any, formData: any) {
    let result = null;
    try {
      let params = new URLSearchParams();
      params.set('serviceId', item.serviceId);
      params.set('date', item.date);
      params.set('time', item.time);
      params.set('firstName', formData.first_name);
      params.set('lastName', formData.second_name);
      params.set('patronymic', formData.patronymic);
      params.set('passport', formData.passport);
      params.set('visitLength', item.visitLength);
console.info(params.toString());

      result = this.http.post(this.server + "index.php/controller_index/recordByDate", params.toString(), {headers: this._headers})
        .toPromise()
        .then(res => this._SuccessCallback(res))
        .catch(err => this._ErrorCallback(err))
    }
    catch (err) {
      console.error("Произошла ошибка", err);
      result = Promise.reject(null);
    }
    return result;
  }



  GetTime(serviceId: number) {
    let result = null;
    try {
      result = this.http.get(this.server + "index.php/controller_index/recordingJSON?serviceId=" + serviceId, {headers: this._headers})
        .toPromise()
        .then(res => this._SuccessCallback(res))
        .catch(err => this._ErrorCallback(err))
    }
    catch (err) {
      console.error("Произошла ошибка", err);
      result = Promise.reject(null);
    }
    return result;
  }







  /**
   * Коллбэк для успешного выполнения запроса
   * @param data
   * @returns {any}
   * @private
   */
  private _SuccessCallback(data) {
    return data.json()
  }

  /**
   * Коллбэк для ошибки
   * @param data
   * @returns {null}
   * @private
   */
  private _ErrorCallback(data) {
    console.error(common_msg.query_execute_err, data);
    let result = null;
    try {
      switch (data.status) {
        case 0:
          result = this._leng.domain_not_resolve;
          break;
        case 404:
          result = this._leng.page_not_found;
          break;
        case 500:
          result = this._leng.internal_error;
          break;
      }
    }
    catch (err) {
      console.error("Произошла ошибка", err);
    }
    return result;
  }


  get(serviceId: number) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(this.server + "index.php/controller_index/getServiceByDepIdJSON/" + serviceId, {headers: headers})
  }

  // getTime(serviceId: number) {
  //   // let data = [
  //   //   {
  //   //     "date": "04.01.2017",
  //   //     "maxTime": "11:15",
  //   //     "minTime": "09:15",
  //   //     "nowTime": "10:06",
  //   //     "time": ["09:15", "09:55", "10:35", "11:15"],
  //   //     "today": "30.12.2016",
  //   //     "visitLength": "40"
  //   //   },
  //   //   {
  //   //     "date": "11.01.2017",
  //   //     "maxTime": "11:15",
  //   //     "minTime": "09:15",
  //   //     "nowTime": "10:14",
  //   //     "time": ["09:15", "09:55", "10:35", "11:15"],
  //   //     "today": "30.12.2016",
  //   //     "visitLength": "40"
  //   //   }
  //   // ]
  //
  //   let headers = new Headers();
  //   headers.set('Content-Type', 'application/x-www-form-urlencoded');
  //   return this.http.get(this.server + "index.php/controller_index/recordingJSON?serviceId=" + serviceId, {headers: headers})
  //
  // }

  // bookLive(serviceId: number, item: any) { // Запись в живую очередь
  //   let headers = new Headers();
  //   headers.set('Content-Type', 'application/x-www-form-urlencoded');
  //   let params = new URLSearchParams()
  //   params.set('serviceId', serviceId.toString())
  //   params.set('date', item.date)
  //   params.set('time', item.time)
  //   let body = params.toString()
  //   return this.http.post(this.server + "index.php/controller_index/recordNow", body, {headers: headers})
  // }

  // book(item: any, formData: any, ) { // Запись по дате
  //  console.info(item, formData, "DATA_BOOK");
  //   // let headers = new Headers();
  //   // headers.set('Content-Type', 'application/x-www-form-urlencoded');
  //   // let params = new URLSearchParams()
  //   // params.set('serviceId', item.id)
  //   // params.set('date', datetimeObj.date)
  //   // params.set('time', datetimeObj.selectedTime)
  //   // params.set('firstName', formData.first_name)
  //   // params.set('lastName', formData.second_name)
  //   // params.set('patronymic', formData.patronymic)
  //   // params.set('passport', formData.passport)
  //   // params.set('visitLength', datetimeObj.visitLength)
  //   // let body = params.toString()
  //   // return this.http.post(this.server + "index.php/controller_index/recordByDate", body, {headers: headers})
  // }

  // getDocuments(serviceId: any) {
  //   let headers = new Headers();
  //   headers.set('Content-Type', 'application/x-www-form-urlencoded');
  //   return new Promise((resolve, reject) => {
  //     this.http.get(this.server + "index.php/controller_index/serviceContentJSON?serviceId=" + serviceId).subscribe(res => {
  //       let data: String = ''
  //       console.info(res.json());
  //       res.json().forEach(document => {
  //         data += '<br>-' + document.name
  //       })
  //       console.log(data)
  //       resolve(data)
  //     }, err => {
  //       reject()
  //     })
  //   })
  // }


}


