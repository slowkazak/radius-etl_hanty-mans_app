import {Injectable} from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import {AuthProvider} from './auth-provider'


import 'rxjs/add/operator/map';

import {Transfer} from 'ionic-native';
import {common_msg} from "../app/settings/common.msg";
import {settings} from "../app/settings/settings";
import {LengProvider} from "./leng-provider";
import _ from "lodash";
import "rxjs/add/operator/toPromise";

@Injectable()
export class ObjectsService {
  private _headers = new Headers();
  private _leng: any = {};
  private _params = new URLSearchParams();
  private _pattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/;


  data: any;
  selected_location: Array<number>

  constructor(public http: Http, private auth: AuthProvider, private lengprovider: LengProvider) {
    this._Init();
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

  /**
   * Добавление нового объекта
   * @param formdata
   * @param media_files
   * @param coords
   * @constructor
   */
  public AddObject(formdata, media_files: any = [], coords: Array<number> = []) {
    let result: any = null;
    this._params.replaceAll(this._params);
    // this._params

    try {
      this._params.set('access_token', this.auth.user.access_token);
      this._params.set('category', formdata.category);
      this._params.set('title', formdata.title);
      this._params.set('description', formdata.description);
      coords.length > 0 ? this._params.set('coordinates', JSON.stringify(coords)) : false;
      let ids = `(${media_files.map(item => item.placemarkId).join(',')})`;
      this._params.set('files', ids);

      console.info(formdata);
      console.info(media_files);
      console.info(coords);

      result = this.http.post(settings.adm_api_path + '/place/add', this._params.toString(), {headers: this._headers})
        .toPromise()
        .then(res => {
          console.info(res)
        })
        .catch(err => {console.error(err)
        })
    }
    catch (err) {
      result = Promise.reject(null);
      console.error("Произошла ошибка", err);
    }
  }

  /**
   * Загрузка файлов
   * @param filepath
   * @returns {Promise<T>}
   * @constructor
   */
  public Upload(filepath: string) {
    return new Promise((resolve, reject) => {
      try {
        let ext = filepath.match(this._pattern)[0];
        let params = {
          fileKey: 'image',
          fileName: 'image' + ext,
          params: {
            'access_token': this.auth.user.access_token
          }
        };
        let idx = _.indexOf(settings.image_file_extentions, ext);
        // idx > -1 ? params.fileKey = "photo" : false;
        const fileTransfer = new Transfer();
        fileTransfer.upload(filepath, settings.adm_api_path + "/place/post", params)
          .then((data: any) => {
            let result = this._UploadSuccessCallback(data, {fileKey: params.fileKey, fileName: params.fileName});
            resolve(result);
          }, (err) => {
            console.error(err, "Upload");
            reject(false);
          })
      }
      catch (err) {
        console.error("Произошла ошибка", err);
        reject(false);
      }
    })
  }

  private _UploadSuccessCallback(data: any, fileinfo: any) {
    let result = null;
    try {
      let _data = JSON.parse(data.response);
      _.has(_data, "placemark_id") ? (fileinfo.placemark_id = _data.placemark_id, result = fileinfo) : false;
    }
    catch (err) {
      console.error("Произошла ошибка", err)
    }

    return result

  }


  // add(form_data: any, media_files: any, coords: Array<number> ) {
  //   let form = form_data.value
  //   console.log(coords,form_data ,media_files, "ADD OBJECT");
  //   let headers = new Headers();
  //   headers.set('Content-Type', 'application/x-www-form-urlencoded')
  //   let params = new URLSearchParams()
  //   params.set('access_token', this.auth.user.access_token)
  //   params.set('category', form.category)
  //   params.set('description', form.description)
  //   params.set('coordinates', JSON.stringify(coords))
  //   if (media_files.length > 0) {
  //     let ids = `(${media_files.map(item => item.placemarkId).join(',')})`
  //     params.set('files', ids)
  //   }
  //   // console.log(form.picture.toString())
  //   let body = params.toString()
  //   return new Promise((resolve, reject) => {
  //     this.http.post('http://api.admhmansy.ru' + '/place/add', body, {headers: headers}).subscribe(res => {
  //       resolve(res.json())
  //     }, err => {
  //       reject(err.json())
  //     })
  //   })
  // }

  //TODO рефактор, затем удалить
  load(filter: any) {
    let params = new URLSearchParams()
    params.set('chk1', filter.display.dumps)
    params.set('chk2', filter.display.roads)
    params.set('chk3', filter.display.offense)
    params.set('chk4', filter.display.improve)
    params.set('stat1', filter.status.solved)
    params.set('stat2', filter.status.processing)
    params.set('stat3', filter.status.not_solved)
    params.set('stat4', filter.status.accepted)

    return this.http.get('http://admhmansy.ru/map/json/getplacemark/index.php', {search: params})
  }


  // uploadPhoto(photo_uri: any) {
  //   const fileTransfer = new Transfer();
  //   return new Promise((resolve, reject) => {
  //     fileTransfer.upload(photo_uri, "http://api.admhmansy.ru/place/post", {
  //       fileKey: 'image',
  //       params: {
  //         'access_token': this.auth.user.access_token
  //       }
  //     })
  //       .then((data: any) => {
  //         console.log(data)
  //         resolve(data.response)
  //       }, (err) => {
  //         console.log(err)
  //         reject(err)
  //       })
  //   })
  // }

  deleteMedia(placemarkId: any) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded')
    let params = new URLSearchParams()
    params.set('access_token', this.auth.user.access_token)
    params.set('placemark_id', placemarkId)
    let body = params.toString()
    this.http.post('http://api.admhmansy.ru' + '/place/delete', body, {headers: headers}).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err)
    })
  }

  // add(form_data: any, media_files: any, coords: Array<number>) {
  //   let form = form_data.value
  //   console.log(media_files, "ADD OBJECT");
  //   let headers = new Headers();
  //   headers.set('Content-Type', 'application/x-www-form-urlencoded')
  //   let params = new URLSearchParams()
  //   params.set('access_token', this.auth.user.access_token)
  //   params.set('category', form.category)
  //   params.set('description', form.description)
  //   params.set('coordinates', JSON.stringify(coords))
  //   if (media_files.length > 0) {
  //     let ids = `(${media_files.map(item => item.placemarkId).join(',')})`
  //     params.set('files', ids)
  //   }
  //   // console.log(form.picture.toString())
  //   let body = params.toString()
  //   console.info(body);
  //   return new Promise((resolve, reject) => {
  //     this.http.post('http://api.admhmansy.ru/place/add', body, {headers: headers}).subscribe(res => {
  //       resolve(res.json())
  //     }, err => {
  //       reject(err.json())
  //     })
  //   })
  // }


  set(data: any) {
    // console.log(data)
    this.data = data
  }

  get(objectId: number) {
    let object: Object = {};
    console.log(objectId)
    for (var prop in this.data) {
      // console.log(object, prop, this.data[prop])
      if (this.data[prop] instanceof Array) object[prop] = this.data[prop][objectId]
    }
    return object;
  }

  transform(data: any) { // превращаем всё в массив объектов
    console.info(data, "DATA")

    let mas = data
    let arr: Array<any> = []
    for (var i = 0; i < data['Total']; i++) {
      let obj = {}
      Object.keys(mas).forEach(function (key) {
        obj[key] = mas[key][i]
      })
      arr.push(obj)
    }
    return arr
  }


}
