import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms'
import {
  NavController, NavParams, LoadingController, ToastController, AlertController,
  PopoverController
} from 'ionic-angular';
import { OmsProvider } from '../../providers/oms-provider'
import {PopoverPage} from "../popover-page/popover-page";

@Component({
  selector: 'page-oms-book-form',
  templateUrl: 'oms-book-form.html',
  providers: [OmsProvider]
})
export class OmsBookFormPage {
  book_form: any

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private oms: OmsProvider,
    private popoverCtrl:PopoverController
  ) {
    this.book_form = this.formBuilder.group({
      first_name: ['', Validators.required],
      second_name: ['', Validators.required],
      patronymic: ['', Validators.required],
      passport: ['', Validators.required]
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OmsBookFormPage');
    console.log(this.navParams.data.datetimeObj)
  }

  book() {
    let loader = this.loadingCtrl.create({
      content: 'Запись...'
    })
    this.oms.book(this.navParams.data.item, this.book_form.value, this.navParams.data.datetimeObj).subscribe(res => {
      loader.dismiss()
      loader.setContent('Получение документов...')
      loader.present()
      this.oms.getDocuments(this.navParams.data.item.id).then(documents => {
        let popover = this.popoverCtrl.create(
          PopoverPage,
          {
          date: this.navParams.data.datetimeObj.date,
          time:this.navParams.data.datetimeObj.selectedTime,
          docs:documents
          }
          );
        // let alert = this.alertCtrl.create({
        //   title: 'Вы записались!',
        //   subTitle: 'Ждём вас ' + this.navParams.data.datetimeObj.date + ' в ' + this.navParams.data.datetimeObj.selectedTime + '.<br>Не забудьте документы:' + documents,
        //   buttons: ['OK']
        // });
        this.navCtrl.popToRoot()
        loader.dismiss()
        popover.present();
        // alert.present();
      }, err => {
        loader.dismiss()
        let toast = this.toastCtrl.create({
          message: 'Произошла ошибка про записи',
          duration: 3000
        })
        toast.present()
      })
    }, err => {
      loader.dismiss()
      let toast = this.toastCtrl.create({
        message: 'Произошла ошибка про записи',
        duration: 3000
      })
      toast.present()
    })
  }

}
