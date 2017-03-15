import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, MenuController} from 'ionic-angular';
import {Splashscreen} from 'ionic-native';
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
  islogged: boolean = false;
  @ViewChild(Nav) nav: Nav;


  constructor(platform: Platform, private auth: AuthProvider,
              private menu: MenuController,
              public notification: NotificationProvider,
              private points: PointsProvider) {

    this.auth.checkAuth().then((user:any) => {
      if (user) {
        this.auth.user = JSON.parse(user);
        this.auth.islogged = true;
        this.rootPage = MenuPage
      } else {
        this.islogged = false;
        this.rootPage = HomePage
      }
    });
    platform.ready().then(() => {

      // document.addEventListener("deviceready", ()=>{





        Splashscreen.hide();
        this.notification._Regiseter();
      // }, false);


      // StatusBar.styleDefault();


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

  private _OpenCabinet() {
    this.menu.close();
    // this.menu.close();
    this.nav.push(UserCabinetPage);
  }
}
