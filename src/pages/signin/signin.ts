import {Component} from '@angular/core';
import {NavController, LoadingController, ToastController} from 'ionic-angular';
import {Validators, FormBuilder} from '@angular/forms'
import {LocationPage} from '../location/location';
import {AuthProvider} from '../../providers/auth-provider'
import _ from "lodash";
import {CommonToast} from "../../helpers/toast.class";
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {
  login_form: any

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public auth: AuthProvider,
              private formBuilder: FormBuilder
    // ,              public toastCtrl: ToastController
  ) {
    this.login_form = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ionViewDidLoad() {
    console.log('Hello SigninPage Page');
  }

  signIn() {
    let loader = this.loadingCtrl.create({
      content: "Пожалуйста, подождите"
    })
    loader.present();
    this.auth.Auth(this.login_form.value.login, this.login_form.value.password).then(res => {
      loader.dismiss();
      let usr: any = {};
      _.has(res, 'access_token') ?
        (usr = {
            login: res.LOGIN,
            first_name: res.NAME,
            second_name: res.LAST_NAME,
            password: '',
            phone: res.PERSONAL_PHONE,
            email: res.EMAIL,
            access_token: res.access_token,
            points: res.points,
            user_id: res.ID
          },
            this.auth.set('user', usr),
            this.navCtrl.push(LocationPage)
        ) :
        CommonToast.ShowToast('Проверьте введенные данные');


      console.info(res)
    }).catch(err => {
      loader.dismiss();
      CommonToast.ShowToast('Проверьте введенные данные')
      console.error(err)
    });
  //   this.auth.signIn(this.login_form.value.login, this.login_form.value.password).subscribe(res => {
  //     loader.dismiss();
  //     console.log(res.json(), "DATA")
  //     this.auth.user = res.json();
  //     this.auth.islogged = true
  //     this.navCtrl.push(LocationPage)
  //   }, err => {
  //     loader.dismiss()
  //     let toast = this.toastCtrl.create({
  //       message: 'Проверьте введенные данные',
  //       duration: 3000
  //     })
  //     toast.present()
  //     console.log(err.json())
  //   })
  }

}
//
//
// this.signup_form.value.first_name,
//   this.signup_form.value.second_name,
//   this.signup_form.value.password,
//   this.signup_form.value.phone,
//   this.signup_form.value.email
// usr.access_token = res.access_token,
//   usr.points = res.points,
//   usr.user_id
//
//
// ACTIVE: "Y"EMAIL: "staskuban@yandex.ru"ID: "4084"LAST_NAME: "Stanislav"LOGIN: "staskuban"NAME: "Stasov"PERSONAL_PHONE: "78837298978"access_token: "b054cf6b85683d29ea5e509be3cd370c395c467127e4"passport_data: nullplatform: "android"points: "407"push_token: "dsizXzxwNU8:APA91bE8fLxX3mRPGzvAovfbCp0xLD7NoTByS--MYjYjRXYeHF5QFAfo9-SwqxZVo12F4Qr4xkeFCucDAEYXOahG3z98AYKJgKUEjfgCQ-7hy_TTI735L-IxgHJSJ3wC-J-Yrg6F30t0"role_id: "2"
