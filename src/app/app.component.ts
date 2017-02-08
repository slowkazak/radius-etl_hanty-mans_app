import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu/menu'
import { AuthProvider } from '../providers/auth-provider'



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  data: Array<any>;
  check: any;

  constructor(platform: Platform, private auth: AuthProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.auth.checkAuth().then((user) => {
        if (user) {
          this.auth.user = JSON.parse(user)
          console.log('User found in storage')
          this.rootPage = MenuPage
        } else this.rootPage = HomePage
      })
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
