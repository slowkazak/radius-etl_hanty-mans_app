import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { LocationPage } from '../../pages/location/location'
import { MenuPage } from '../../pages/menu/menu'
import { PoolsPage } from '../../pages/pools/pools'
import {PopoverPage} from "../../pages/popover-page/popover-page";

@NgModule({
  imports: [
    IonicModule.forRoot(LocationPage),
    IonicModule.forRoot(MenuPage),
    IonicModule.forRoot(HomePage, {
      mode: 'ios'
    }),
    IonicModule.forRoot(PoolsPage),
    IonicModule.forRoot(PopoverPage)
  ],
  declarations: [
    LocationPage,
    MenuPage,
    HomePage,
    PoolsPage,
    PopoverPage
  ],
  exports: [
    LocationPage,
    MenuPage,
    HomePage,
    PoolsPage,
    PopoverPage
  ]
})
export class PagesModule {}
