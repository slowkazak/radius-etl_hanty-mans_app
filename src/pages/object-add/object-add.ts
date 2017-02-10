import { Component } from '@angular/core';
import { NavController, ViewController, ActionSheetController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms'
import { Camera, FilePath, MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from 'ionic-native';
import { ObjectsService } from '../../providers/objects-service'
import { location } from '../../models/location'
import { LocationSelectPage } from '../location-select/location-select'

@Component({
  selector: 'page-object-add',
  templateUrl: 'object-add.html',
  providers: [ObjectsService]
})
export class ObjectAddPage {
  form: any
  mapPage: any = LocationSelectPage
  coords: any = this.location.coords
  media: Array<any> = []

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private service: ObjectsService,
    public location: location,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.form = this.formBuilder.group({
      description: ['', Validators.required],
      category: ['', Validators.required]
    })
  }

  ionViewDidLoad() {
    console.log(this.location.coords)
    console.log('Hello ObjectAddPage Page');
  }


  dismiss() {
    this.navCtrl.pop()
  }

  addValue() {
    this.form.picture = 'kek'
    console.log(this.form)
  }

  takePhoto() {
    Camera.getPicture({
      quality: 70,
      destinationType: Camera.DestinationType.FILE_URI
    }).then((imageData) => {
      console.log('got image data', imageData)
      let loader = this.loadingCtrl.create({
        content: "Загрузка фотографии"
      })
      loader.present()
      FilePath.resolveNativePath(imageData).then(result => {
        this.service.uploadPhoto(result).then((data) => {
          this.media.push({
            'type': 'photo',
            'url': result,
            'placemarkId': JSON.parse(data.toString())['placemark_id']
          })
          loader.dismiss()
        }, err => {
          if (err.http_status === 413) {
            let toast = this.toastCtrl.create({
              message: 'Ошибка, файл слишком большой',
              duration: 3000
            })
            toast.present()
          }
          loader.dismiss()
          console.log(err)
        })
      }, err => {
        loader.dismiss()
      })
      // this.form.picture = imageData
      // console.log(imageData)
    })
  }

  deleteMedia(index: number) {
    console.log(index, this.media)
    let placemarkId = this.media[index].placemarkId
    this.service.deleteMedia(placemarkId)
    this.media.splice(index,1)
  }

  captureVideo() {
    let options: CaptureVideoOptions = { duration: 120 }
    MediaCapture.captureVideo(options)
      .then((data: MediaFile[]) => {
        let loader = this.loadingCtrl.create({
          content: "Загрузка видео"
        })
        loader.present()
        console.log(data)
          this.service.uploadPhoto(data[0].fullPath).then((data) => {
            this.media.push({
              'type': 'video',
              'url': data[0].fullPath,
              'placemarkId': JSON.parse(data.toString())['placemark_id']
            })
            loader.dismiss()
          }, err => {
            if (err.http_status === 413) {
              let toast = this.toastCtrl.create({
                message: 'Ошибка, файл слишком большой',
                duration: 3000
              })
              toast.present()
            }
            loader.dismiss()
          })
      },
      (err: CaptureError) => console.error(err)
    )
  }

  loadPhoto(photo_uri: any) {

  }

  getPhotoFromGallery() {
    Camera.getPicture({
      sourceType: 0,
      destinationType: Camera.DestinationType.FILE_URI
    }).then((imageData) => {
      console.log('got image data', imageData)
      let loader = this.loadingCtrl.create({
        content: "Загрузка фотографии"
      })
      loader.present()
      FilePath.resolveNativePath(imageData).then(result => {
        this.service.uploadPhoto(result).then((data) => {
          console.log(JSON.parse(data.toString()))
          this.media.push({
            'type': 'photo',
            'url': result,
            'placemarkId': JSON.parse(data.toString())['placemark_id']
          })
          loader.dismiss()
        }, err => {
          console.log(err.http_status)
          if (err.http_status === 413) {
            let toast = this.toastCtrl.create({
              message: 'Ошибка, файл слишком большой',
              duration: 3000
            })
            toast.present()
          }
          loader.dismiss()
        })
      }, err => {
        console.log(err)
        loader.dismiss()
      })
      // this.form.picture = imageData
      // console.log(imageData)
    })
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Загрузить фотографию',
      cssClass: 'action-sheet',
      buttons: [
        {
          text: 'Сделать фото',
          icon: 'camera',
          handler: () => {
            this.takePhoto()
            console.log('Take a photo clicked')
          }
        },
        {
          text: 'Выбрать из галлереи',
          icon: 'images',
          handler: () => {
            this.getPhotoFromGallery()
            console.log('Choose photo clicked')
          }
        },
        {
          text: 'Записать видео',
          icon: 'videocam',
          handler: () => {
            this.captureVideo()
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

  addObject() {
    // if (!this.form.valid) return false
    let loader = this.loadingCtrl.create({
      content: "Пожалуйста, подождите"
    })
    loader.present()
    console.log(this.media, `(${this.media.map(item => item.placemarkId).join(',')})`)
    this.service.add(this.form, this.media, this.location.get()).then(res => {
      console.log(res)
      loader.dismiss();
      let toast = this.toastCtrl.create({
        message: 'Объект добавлен',
        duration: 3000
      })
      toast.present()
      this.navCtrl.popToRoot()
    }, err => {
      console.log(err)
      loader.dismiss()
      let toast = this.toastCtrl.create({
        message: 'Произошла ошибка. Повторите попытку позже',
        duration: 3000
      })
      toast.present()
      this.navCtrl.popToRoot()
    })
  }

  openMap() {
    this.navCtrl.push(LocationSelectPage, {title: this.form.value})
  }


}
