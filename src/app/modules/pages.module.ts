import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {HomePage} from '../../pages/home/home';
import {LocationPage} from '../../pages/location/location'
import {MenuPage} from '../../pages/menu/menu'
import {PoolsPage} from '../../pages/pools/pools'
import {PopoverPage} from "../../pages/popover-page/popover-page";
import {NewsFeedPage} from "../../pages/news-feed/news-feed";
import {PollComponent} from "../../components/poll/poll";

@NgModule({
  imports: [
    IonicModule.forRoot(LocationPage),
    IonicModule.forRoot(MenuPage),
    IonicModule.forRoot(HomePage, {
      mode: 'ios'
    }),
    IonicModule.forRoot(PoolsPage),
    IonicModule.forRoot(PopoverPage),
    IonicModule.forRoot(NewsFeedPage),
    IonicModule.forRoot(PollComponent)
  ],
  declarations: [
    LocationPage,
    MenuPage,
    HomePage,
    PoolsPage,
    PopoverPage,
    NewsFeedPage,
    PollComponent
  ],
  exports: [
    LocationPage,
    MenuPage,
    HomePage,
    PoolsPage,
    PopoverPage,
    NewsFeedPage,
    PollComponent
  ]
})
export class PagesModule {
}
