import { NgModule, ErrorHandler, enableProdMode } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { PagesModule } from './modules/pages.module';
import { ServicesModule } from './modules/services.module';
import { DashboardModule } from './modules/dashboard.module';
import { AuthModule } from './modules/auth.module';
import { Filter } from '../models/filters';
import { location } from '../models/location';
import { AuthProvider } from '../providers/auth-provider';
import {LengProvider} from "../providers/leng-provider"
import {GeolocationProvider} from "../providers/geolocation-provider";
import {NotificationProvider} from "../providers/notification-provider";
import {PointsProvider} from "../providers/points-provider";
import {MfcModule} from "../mfc/mfc.module";


enableProdMode();

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    PagesModule,
    DashboardModule,
    AuthModule,
    MfcModule,
    ServicesModule,
    IonicModule.forRoot(MyApp, {
      mode: 'md'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Filter, AuthProvider, location, Storage, LengProvider, GeolocationProvider, NotificationProvider, PointsProvider]
})
export class AppModule {}
