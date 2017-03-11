import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, MenuController} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {HomePage} from '../pages/home/home';
import {AuthProvider} from '../providers/auth-provider'

import {MenuPage} from "../pages/menu/menu";
import {NotificationProvider} from "../providers/notification-provider";
import {PointsProvider} from "../providers/points-provider";
import {UserCabinetPage} from "../pages/user-cabinet/user-cabinet";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  data: Array<any>;
  check: any;
  islogged: boolean = false;
  @ViewChild(Nav) nav: Nav;
  HomePage: any = HomePage;


  constructor(platform: Platform, private auth: AuthProvider, private menu: MenuController,
              public notification: NotificationProvider, private points: PointsProvider) {



    platform.ready().then(() => {


       this.notification._Regiseter();


      this.auth.checkAuth().then((user) => {
console.info(user,1111)
        if (user) {

          this.auth.user = JSON.parse(user);
          this.auth.islogged = true;
          console.log('User found in storage', this.auth.user)
          this.rootPage = MenuPage
        } else {

          this.islogged = false;
          this.rootPage = HomePage
        }

      })
      StatusBar.styleDefault();
      Splashscreen.hide();

    });

  }

  /**
   * Открывает кабинет пользователя
   * @private
   */

  openPage(page) {
    this.menu.close();
    this.nav.push(page.component);
  }

  exit() {
    this.menu.close();
    this.auth.clearStorage()
    this.nav.setRoot(HomePage, {}, {animate: true, direction: 'backwards'})
  }
  private _OpenCabinet(){
    this.menu.close();
    // this.menu.close();
    this.nav.push(UserCabinetPage);
  }
  // exit() {
  //   this.auth.clearStorage();
  //   this.menu.close();
  //   this.auth.islogged = false;
  //   this.nav.setRoot(HomePage, {}, {animate: true, direction: 'backwards'})
  // }


}
