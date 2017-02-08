import { Component } from '@angular/core';
import { MyApp } from '../../app/app.component';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home'
import { DashboardPage } from '../dashboard/dashboard'
import { ServicesPage } from '../services/services'
import { PoolsPage } from '../pools/pools'
import { OmsPage } from '../oms-page/oms-page'
import { AuthProvider } from '../../providers/auth-provider'

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  DashboardPage: any = DashboardPage
  ServicesPage: any = ServicesPage
  PoolsPage: any = PoolsPage
  OmsPage: any = OmsPage

  constructor(public navCtrl: NavController, public auth: AuthProvider) {
    this.navCtrl = navCtrl
  }

  openPage(page: any) {
    this.navCtrl.push(page)
  }

  ionViewDidLoad() {
    console.log(this.auth.user)
    console.log('Hello MenuPage Page');
  }

  exit() {
    this.auth.clearStorage()
    this.navCtrl.setRoot(HomePage, {}, {animate: true, direction: 'backwards'})
  }

}
