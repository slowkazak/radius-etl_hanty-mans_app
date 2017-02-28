import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {HomePage} from '../../pages/home/home';
import {LocationPage} from '../../pages/location/location'
import {MenuPage} from '../../pages/menu/menu'
import {PoolsPage} from '../../pages/pools/pools'
import {PopoverPage} from "../../pages/popover-page/popover-page";
import {NewsFeedPage} from "../../pages/news-feed/news-feed";
import {PollComponent} from "../../components/poll/poll";
import {NewsSliderComponent} from "../../components/news-slider/news-slider"
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
    IonicModule.forRoot(PollComponent),
    IonicModule.forRoot(NewsSliderComponent)
  ],
  declarations: [
    LocationPage,
    MenuPage,
    HomePage,
    PoolsPage,
    PopoverPage,
    NewsFeedPage,
    PollComponent,
    NewsSliderComponent
  ],
  exports: [
    LocationPage,
    MenuPage,
    HomePage,
    PoolsPage,
    PopoverPage,
    NewsFeedPage,
    PollComponent,
    NewsSliderComponent
  ]
})
export class PagesModule {
}
