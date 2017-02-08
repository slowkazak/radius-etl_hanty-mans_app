import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms'
import { LocationPage } from '../location/location'
import { AuthProvider } from '../../providers/auth-provider'

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup_form: any

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public auth: AuthProvider,
    private formBuilder: FormBuilder,
    public toastCtrl: ToastController
  )
  {
    this.signup_form = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      first_name: ['', Validators.required],
      second_name: ['', Validators.required]
    })
  }

  ionViewDidLoad() {
    console.log('Hello SignupPage Page');
  }

  signUp() {
    let loader = this.loadingCtrl.create({
      content: "Пожалуйста, подождите"
    })
    loader.present()

    this.auth.signUp(this.signup_form.value.login, this.signup_form.value.first_name, this.signup_form.value.second_name, this.signup_form.value.password).subscribe(res => {
      loader.dismiss();
      console.log(res.json())
      this.auth.user = res.json()
      this.navCtrl.push(LocationPage)
    }, err => {
      loader.dismiss()
      let toast = this.toastCtrl.create({
        message: 'Проверьте введенные данные',
        duration: 3000
      })
      toast.present()
      console.log(err.json())
    })
  }


}
