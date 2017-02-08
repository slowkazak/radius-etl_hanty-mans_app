import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard'
import { SigninPage } from '../signin/signin'
import { SignupPage } from '../signup/signup'
import { MenuPage } from '../menu/menu'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  goToSignIn() {
    this.navCtrl.push(SigninPage)
  }

  goToSignUp() {
    this.navCtrl.push(SignupPage)
  }

  skip() {
    this.navCtrl.setRoot(MenuPage, {}, {animate: true, direction: 'forward'})
  }
}
