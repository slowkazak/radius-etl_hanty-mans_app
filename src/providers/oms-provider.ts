import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthProvider } from './auth-provider'

@Injectable()
export class OmsProvider {
  services: Array<Object>
  server: String = 'http://217.115.185.188:6449/'

  constructor(public http: Http, private auth: AuthProvider) {
    console.log('Hello OmsProvider Provider');
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

  get(serviceId: number) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(this.server + "index.php/controller_index/getServiceByDepIdJSON/" + serviceId, {headers: headers})
  }

  getTime(serviceId: number) {
    // let data = [
    //   {
    //     "date": "04.01.2017",
    //     "maxTime": "11:15",
    //     "minTime": "09:15",
    //     "nowTime": "10:06",
    //     "time": ["09:15", "09:55", "10:35", "11:15"],
    //     "today": "30.12.2016",
    //     "visitLength": "40"
    //   },
    //   {
    //     "date": "11.01.2017",
    //     "maxTime": "11:15",
    //     "minTime": "09:15",
    //     "nowTime": "10:14",
    //     "time": ["09:15", "09:55", "10:35", "11:15"],
    //     "today": "30.12.2016",
    //     "visitLength": "40"
    //   }
    // ]

    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(this.server + "index.php/controller_index/recordingJSON?serviceId=" + serviceId, {headers: headers})

  }

  bookLive(serviceId: number, item: any) { // Запись в живую очередь
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let params = new URLSearchParams()
    params.set('serviceId', serviceId.toString())
    params.set('date', item.date)
    params.set('time', item.time)
    let body = params.toString()
    return this.http.post(this.server + "index.php/controller_index/recordNow", body, {headers: headers})
  }

  book(item: any, formData: any, datetimeObj: any) { // Запись по дате
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let params = new URLSearchParams()
    params.set('serviceId', item.id)
    params.set('date', datetimeObj.date)
    params.set('time', datetimeObj.selectedTime)
    params.set('firstName', formData.first_name)
    params.set('lastName', formData.second_name)
    params.set('patronymic', formData.patronymic)
    params.set('passport', formData.passport)
    params.set('visitLength', datetimeObj.visitLength)
    let body = params.toString()
    return this.http.post(this.server + "index.php/controller_index/recordByDate", body, {headers: headers})
  }

  getDocuments(serviceId: any) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return new Promise((resolve, reject) => {
      this.http.get(this.server + "index.php/controller_index/serviceContentJSON?serviceId=" + serviceId).subscribe(res => {
        let data: String = ''
        res.json().forEach(document => {
          data+='<br>-' + document.name
        })
        console.log(data)
        resolve (data)
      }, err => {
        reject()
      })
    })
  }
}
