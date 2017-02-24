import {Component, ViewChild} from '@angular/core';
import {
  NavController,
  ViewController,
  ActionSheetController,
  LoadingController
} from 'ionic-angular';

import {Validators, FormBuilder} from '@angular/forms'
import {
  File,
  Camera,
  FilePath,
  MediaCapture,
  MediaFile,
  CaptureError,
  CaptureImageOptions,
  CaptureVideoOptions,
  Toast
} from 'ionic-native';
declare var cordova: any;
import FileAPI from  "../../../node_modules/file-api/index.js"

import {ObjectsService} from '../../providers/objects-service'
import {location} from '../../models/location'
import {LocationSelectPage} from '../location-select/location-select'
import _ from "lodash";
import {LengProvider} from "../../providers/leng-provider";
import {settings} from "../../app/settings/settings";
import {DashboardPage} from "../dashboard/dashboard";
@Component({
  selector: 'page-object-add',
  templateUrl: 'object-add.html',
  providers: [ObjectsService]
})
export class ObjectAddPage {
  form: any
  mapPage: any = LocationSelectPage
  coords: any = this.location.coords;

  @ViewChild("fl") fl: any;
  private _pattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/;
  media: Array<{url: any, type: any, file: any}> = [];
  private _leng: any = {};
  private _loader: any = this.loadingCtrl.create({});

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public actionSheetCtrl: ActionSheetController,
              private formBuilder: FormBuilder,
              private service: ObjectsService,
              public location: location,
              public loadingCtrl: LoadingController,
              private leng: LengProvider) {
    this.form = this.formBuilder.group({
      description: ['', Validators.required],
      category: ['', Validators.required]
    })
  }

  /**
   * Установка плейсхолдеров для изображений
   * @private
   */
  private _SetPlaceholder() {
    while (this.media.length < settings.object_media_placeholder_count) {
      this.media.push({url: null, type: null, file: null})
    }
  }

  private _ToastPresent(msg: string = null) {
    if (msg) {
      Toast.show(msg, '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        }
      );
    }
  }

  ionViewDidLoad() {
    this.leng.GetLeng("object_add").then(res => {
      this._leng = _.assign({}, res);
    }).catch(err => {
      this._leng = _.assign({}, err);
    });
    this._SetPlaceholder();
  }


  dismiss() {
    this.navCtrl.pop()
  }

  /**
   * Добавлление заявки
   * @constructor
   */
  AddObject() {
    this._loader.present();
    this.service.AddObject(this.form.value, this.media, this.location.Get()).then(res => {

      this._loader.dismiss();
      this._ToastPresent(this._leng.add_success);
      this.navCtrl.pop(DashboardPage);
    }).catch(err => {
      this._loader.dismiss();
      this._ToastPresent(this._leng.add_err_common)
    })
  }

  takePhoto(idx: number) {
    Camera.getPicture({
      quality: 70,
      destinationType: Camera.DestinationType.FILE_URI
    }).then((imageData) => {

      this._RenderMedia(imageData, idx);


      // this._loader.present();
      // this.service.Upload(imageData).then(res => {
      //   this._loader.dismiss();
      //   res ? this._RenderMedia(imageData, res) : this._ToastPresent(this._leng.add_err_file_load_err)
      // }).catch(err => {
      //   this._loader.dismiss();
      //   this._ToastPresent(this._leng.add_err_file_load_err);
      //   console.error(err);
      // });


      // this.service.Upload(imageData);
      // let loader = this.loadingCtrl.create({
      //   content: "Загрузка фотографии"
      // }).
      // loader.present()
      // FilePath.resolveNativePath(imageData).then(result => {
      //   this.service.uploadPhoto(result).then((data) => {
      //     this.media.push({
      //       'type': 'photo',
      //       'url': result,
      //       'placemarkId': JSON.parse(data.toString())['placemark_id']
      //     })
      //     // loader.dismiss()
      //   }, err => {
      //     if (err.http_status === 413) {
      //       let toast = this.toastCtrl.create({
      //         message: 'Ошибка, файл слишком большой',
      //         duration: 3000
      //       })
      //       toast.present()
      //     }
      //     // loader.dismiss()
      //     console.log(err)
      //   })
      // }, err => {
      //   // loader.dismiss()
      // })
      // this.form.picture = imageData
      // console.log(imageData)
    })
  }

  deleteMedia(index: number) {
    this.media[index].url = null;
    this.media[index].type = null;
    // let placemarkId = this.media[index].placemarkId
    // this.service.deleteMedia(placemarkId)
    // this.media.splice(index, 1)
  }

  captureVideo(idx: number) {
    let options: CaptureVideoOptions = {duration: 10, limit: 1};
    MediaCapture.captureVideo(options)
      .then((data: MediaFile[]) => {
          this._RenderMedia(data[0].fullPath, idx);
          // this._loader.present();
          // this.service.Upload(data[0].fullPath).then(res => {
          //   this._loader.dismiss();
          //   res ? this._RenderMedia(data[0].fullPath, res) : this._ToastPresent(this._leng.add_err_file_load_err);
          // }).catch(err => {
          //   this._loader.dismiss();
          //   this._ToastPresent(this._leng.add_err_file_load_err);
          //   console.error(err)
          // });
          // let pattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/;
          // var ma1 = fl.match(pattern)
          // console.log(ma1);
          // this.service.Upload(fl.fullPath);

          // console.log(data)
          //   this.service.uploadPhoto(data[0].fullPath).then((data) => {
          //     this.media.push({
          //       'type': 'video',
          //       'url': data[0].fullPath,
          //       'placemarkId': JSON.parse(data.toString())['placemark_id']
          //     })
          //     loader.dismiss()
          //   }, err => {
          //     if (err.http_status === 413) {
          //       let toast = this.toastCtrl.create({
          //         message: 'Ошибка, файл слишком большой',
          //         duration: 3000
          //       })
          //       toast.present()
          //     }
          //     loader.dismiss()
          //   })
        },
        (err: CaptureError) => {
          this._loader.dismiss();
          console.error(err);
        }
      )
  }

  /**
   * Рендеринг файлов и подготовка к отправке на сервер
   * @param filepath
   * @param idx
   * @private
   */

  private _RenderMedia(filepath: string, idx: number) {
    this._loader.present();
    FilePath.resolveNativePath(filepath)
      .then(_filePath => {
        let ext = filepath.match(this._pattern)[0];
        let index = _.indexOf(settings.image_file_extentions, ext);


        let rest = _filePath.substring(0, _filePath.lastIndexOf("/") + 1);
        let last = _filePath.substring(_filePath.lastIndexOf("/") + 1, _filePath.length);

        File.readAsDataURL(rest, last).then(
          (res) => {
            this._loader.dismiss();
            index > -1 ? this.media[idx].type = "photo" : this.media[idx].type = "video";
            this.media[idx].url = _filePath;
            this.media[idx].file = res
          }
        ).catch(err => {
          this._loader.dismiss();
          console.log(err, 'boooh')
        });
      })
      .catch(err => {
        this._loader.dismiss();
        console.log(err, filepath)
      });

  }

  getPhotoFromGallery(idx: number) {
    Camera.getPicture({
      sourceType: 0,
      destinationType: Camera.DestinationType.FILE_URI
    }).then((imageData) => {
      // this._loader.present();
      FilePath.resolveNativePath(imageData).then(result => {
        this._RenderMedia(result, idx);


        // this.service.Upload(imageData).then(res => {
        //   this._loader.dismiss();
        //   res ? this._RenderMedia(imageData, res) : this._ToastPresent(this._leng.add_err_file_load_err);
        // }).catch(err => {
        //   this._loader.dismiss();
        //   this._ToastPresent(this._leng.add_err_file_load_err);
        //   console.error(err)
        // });

        // this.service.uploadPhoto(result).then((data) => {
        //   console.log(JSON.parse(data.toString()))
        //   this.media.push({
        //     'type': 'photo',
        //     'url': result,
        //     'placemarkId': JSON.parse(data.toString())['placemark_id']
        //   })
        //   loader.dismiss()
        // }, err => {
        //   console.log(err.http_status)
        //   if (err.http_status === 413) {
        //     let toast = this.toastCtrl.create({
        //       message: 'Ошибка, файл слишком большой',
        //       duration: 3000
        //     })
        //     toast.present()
        //   }
        //   loader.dismiss()
        // })
      }, err => {
        this._loader.dismiss();
        console.log(err);
      })
    })
  }

  presentActionSheet(idx: number) {
    console.info(idx);
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Загрузить фотографию',
      cssClass: 'action-sheet',
      buttons: [
        {
          text: 'Сделать фото',
          icon: 'camera',
          handler: () => {
            this.takePhoto(idx)
            console.log('Take a photo clicked')
          }
        },
        {
          text: 'Выбрать из галлереи',
          icon: 'images',
          handler: () => {
            this.getPhotoFromGallery(idx)
            console.log('Choose photo clicked')
          }
        },
        {
          text: 'Записать видео',
          icon: 'videocam',
          handler: () => {
            this.captureVideo(idx)
            console.log('Choose photo clicked')
          }
        },
        {
          text: 'Отмена',
          icon: 'close',
          role: 'cancel',
          handler: () => [
            console.log('Cancel clicked')
          ]
        }
      ]
    })
    actionSheet.present()
  }

  // addObject() {
  //   // if (!this.form.valid) return false
  //   this._loader.present();
  //
  //   this.service.add(this.form, this.media, this.location.Get()).then(res => {
  //     console.log(res);
  //     this._loader.dismiss();
  //     this._ToastPresent(this._leng.add_success);
  //     this.navCtrl.popToRoot()
  //   }, err => {
  //     console.log(err);
  //     this._loader.dismiss();
  //     this._ToastPresent(this._leng.add_err_common);
  //     this.navCtrl.popToRoot()
  //   })
  // }

  openMap() {
    this.navCtrl.push(LocationSelectPage, {title: this.form.value})
  }


}
