import {Component} from '@angular/core';
import {Validators, FormBuilder} from '@angular/forms'
import {Toast} from "ionic-native";
import {
  NavController, NavParams, LoadingController, PopoverController
} from 'ionic-angular';
import {OmsProvider} from '../../providers/oms-provider'
import {PopoverPage} from "../popover-page/popover-page";

@Component({
  selector: 'page-oms-book-form',
  templateUrl: 'oms-book-form.html',
  providers: [OmsProvider]
})
export class OmsBookFormPage {
  book_form: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              private oms: OmsProvider,
              private popoverCtrl: PopoverController) {
    this.book_form = this.formBuilder.group({
      first_name: ['', Validators.required],
      second_name: ['', Validators.required],
      patronymic: ['', Validators.required],
      passport: ['', Validators.required]
    })
  }

  ionViewDidLoad() {

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

  book() {
    let loader = this.loadingCtrl.create({
      content: 'Запись...'
    });
    loader.present();
    this.oms.Book(this.navParams.get('data'), this.book_form.value).then(res => {
      let sid = this.navParams.get('data');
      res ? this.oms.GetDocuments(sid.serviceId).then(result => {
          loader.dismiss();
          let popover = this.popoverCtrl.create(
            PopoverPage,
            {
              date: sid.date,
              time: sid.time,
              docs: result
            }
          );
          popover.present();
          this.navCtrl.popToRoot();
        }).catch(err => {
          this._ToastPresent("Произошла ошибка про записи");
          loader.dismiss();
          console.error(err)
        }) : false
    }).catch(err => {this._ToastPresent("Произошла ошибка про записи");loader.dismiss();console.error(err)});
    //
    //   .subscribe(res => {
    //   loader.dismiss()
    //   loader.setContent('Получение документов...')
    //   loader.present()
    //   this.oms.getDocuments(this.navParams.data.item.id).then(documents => {
    //     let popover = this.popoverCtrl.create(
    //       PopoverPage,
    //       {
    //       date: this.navParams.data.datetimeObj.date,
    //       time:this.navParams.data.datetimeObj.selectedTime,
    //       docs:documents
    //       }
    //       );
    //     // let alert = this.alertCtrl.create({
    //     //   title: 'Вы записались!',
    //     //   subTitle: 'Ждём вас ' + this.navParams.data.datetimeObj.date + ' в ' + this.navParams.data.datetimeObj.selectedTime + '.<br>Не забудьте документы:' + documents,
    //     //   buttons: ['OK']
    //     // });
    //     this.navCtrl.popToRoot()
    //     loader.dismiss()
    //     popover.present();
    //     // alert.present();
    //   }, err => {
    //     loader.dismiss()
    //     let toast = this.toastCtrl.create({
    //       message: 'Произошла ошибка про записи',
    //       duration: 3000
    //     })
    //     toast.present()
    //   })
    // }, err => {
    //   loader.dismiss()
    //   let toast = this.toastCtrl.create({
    //     message: 'Произошла ошибка про записи',
    //     duration: 3000
    //   })
    //   toast.present()
    // })
  }

}
