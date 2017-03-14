import {Component} from '@angular/core';
import {Validators, FormBuilder} from '@angular/forms'
import {Toast} from "ionic-native";
import {
  NavController, NavParams, LoadingController, PopoverController
} from 'ionic-angular';
import {OmsProvider} from '../../providers/oms-provider'
import {PopoverPage} from "../popover-page/popover-page";
import {AuthProvider} from "../../providers/auth-provider";
import _ from "lodash"

@Component({
  selector: 'page-oms-book-form',
  templateUrl: 'oms-book-form.html',
  providers: [OmsProvider]
})
export class OmsBookFormPage {
  private book_form: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              private oms: OmsProvider,
              private popoverCtrl: PopoverController,
              private auth: AuthProvider) {
    //
    // this.book_form = this.formBuilder.group({
    //   first_name: ['', Validators.required],
    //   second_name: ['', Validators.required],
    //   patronymic: ['', Validators.required],
    //   passport: ['', Validators.required]
    // })
  }


  ngAfterContentInit() {
    this._InitPage();
  }

  private _InitPage() {

    let userdata = {first_name: '', second_name: '', patronymic: '', passport_data: '', rawobject: null};

    try {
      userdata.rawobject = this.auth.Get().user;
      console.warn(userdata)
      !_.isEmpty(userdata.rawobject) ? (
          userdata.first_name = userdata.rawobject.first_name,
            userdata.second_name = userdata.rawobject.second_name,
            !_.isEmpty(userdata.rawobject.passport_data) ? userdata.passport_data = atob(userdata.rawobject.passport_data) : false
        ) : false;
    }
    catch (err) {
      console.error("Произошла ошибка", err)
    }

    this.book_form = this.formBuilder.group({
      first_name: [userdata.first_name, Validators.required],
      second_name: [userdata.second_name, Validators.required],
      patronymic: [userdata.patronymic, Validators.required],
      passport: [userdata.passport_data, Validators.required]
    })
  }


  ionViewDidLoad() {
    console.info(this.navParams.get('datetitle'));
    this.auth.Get()

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
              title:sid.datetitle,
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
    }).catch(err => {
      this._ToastPresent("Произошла ошибка про записи");
      loader.dismiss();
      console.error(err)
    });
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
