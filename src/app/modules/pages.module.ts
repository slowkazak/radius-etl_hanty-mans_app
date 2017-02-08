import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { LocationPage } from '../../pages/location/location'
import { MenuPage } from '../../pages/menu/menu'
import { PoolsPage } from '../../pages/pools/pools'

@NgModule({
  imports: [
    IonicModule.forRoot(LocationPage),
    IonicModule.forRoot(MenuPage),
    IonicModule.forRoot(HomePage, {
      mode: 'ios'
    }),
    IonicModule.forRoot(PoolsPage)
  ],
  declarations: [
    LocationPage,
    MenuPage,
    HomePage,
    PoolsPage
  ],
  exports: [
    LocationPage,
    MenuPage,
    HomePage,
    PoolsPage
  ]
})
export class PagesModule {}
