import {Component} from '@angular/core';
import {NavController, LoadingController, ToastController} from 'ionic-angular';
import {Validators, FormBuilder} from '@angular/forms'
import {LocationPage} from '../location/location'
import {AuthProvider} from '../../providers/auth-provider'
import {CommonToast} from "../../helpers/toast.class";
import {LengProvider} from "../../providers/leng-provider";
import _ from "lodash";
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup_form: any;
  private _leng: any = {};

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public auth: AuthProvider,
              private formBuilder: FormBuilder,
              private leng: LengProvider) {
    this.signup_form = this.formBuilder.group({
      login: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      first_name: ['', Validators.required],
      second_name: ['', Validators.required]
    })
  }

  ionViewDidLoad() {
    this.leng.GetLeng("sign").then(res => {
      this._leng = _.assign({}, res);
    }).catch(err => {
      this._leng = _.assign({}, err);
    });

  }

  signUp() {
    let loader = this.loadingCtrl.create({
      content: "Пожалуйста, подождите"
    })
    // loader.present()

    let _callback = (data) => {
      this.auth.set('user', data);
      this.navCtrl.push(LocationPage)
    };


    let usr: any = {};

    this.auth.Rerister(this.signup_form.value.login,
      this.signup_form.value.first_name,
      this.signup_form.value.second_name,
      this.signup_form.value.password,
      this.signup_form.value.phone,
      this.signup_form.value.email).then(res => {
      _.has(res, 'access_token') ? (
          usr = this.signup_form.value,
            usr.access_token = res.access_token,
            usr.points = res.points,
            usr.user_id = res.user_id,
            _callback(usr)
        ) : false
    }).catch(err => {
      CommonToast.ShowToast(this._leng.signup_err)
    });


    //Rerister(login: string, first_name: string, second_name: string, password: string, phone: string, email: string)
    // this.auth.signUp(this.signup_form.value.login, this.signup_form.value.first_name, this.signup_form.value.second_name, this.signup_form.value.password,this.signup_form.value.phone,this.signup_form.value.email).subscribe(res => {
    //   loader.dismiss();
    //   console.log(res.json())
    //   this.auth.user = res.json()
    //   this.navCtrl.push(LocationPage)
    // }, err => {
    //   loader.dismiss()
    //   let toast = this.toastCtrl.create({
    //     message: 'Проверьте введенные данные',
    //     duration: 3000
    //   })
    //   toast.present()
    //   console.log(err.json())
    // })
  }


}
