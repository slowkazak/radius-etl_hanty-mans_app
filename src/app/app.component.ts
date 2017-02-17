import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, MenuController} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {HomePage} from '../pages/home/home';
// import {MenuPage} from '../pages/menu/menu'
import {AuthProvider} from '../providers/auth-provider'
import {NewsFeedPage} from "../pages/news-feed/news-feed";
import {DashboardPage} from "../pages/dashboard/dashboard";
import {PoolsPage} from "../pages/pools/pools";
import {OmsPage} from "../pages/oms-page/oms-page";
import {ServicesPage} from "../pages/services/services";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  data: Array<any>;
  check: any;
  islogged: boolean = false;
  @ViewChild(Nav) nav: Nav;
  private _menu_items = null;

  constructor(platform: Platform, private auth: AuthProvider, private menu:MenuController) {
    this._menu_items = [
      {title: "Улучшим наш город", component: DashboardPage, onlywithtoken:true},
      {title: "Опросы", component: PoolsPage, onlywithtoken:true},
      {title: "Запись на приём в ОМС", component: OmsPage, onlywithtoken:false},
      {title: "Запись на приём в МФЦ Югры", component: ServicesPage, onlywithtoken:false}
    ];
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.auth.checkAuth().then((user) => {
        if (user) {
          this.auth.user = JSON.parse(user);
          this.islogged = true;
          console.log('User found in storage',this.auth.user)
          this.rootPage = NewsFeedPage
        } else {
          this.islogged = false;
          this.rootPage = HomePage
        }

      })
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    this.menu.close();
    this.nav.push(page.component);
  }
  exit() {
    this.auth.clearStorage();
    this.menu.close();
    this.nav.setRoot(HomePage, {}, {animate: true, direction: 'backwards'})
  }

}
