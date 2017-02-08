import { NgModule, ErrorHandler, enableProdMode } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { MyApp } from './app.component';
import { PagesModule } from './modules/pages.module'
import { ServicesModule } from './modules/services.module'
import { DashboardModule } from './modules/dashboard.module'
import { AuthModule } from './modules/auth.module'
import { Filter } from '../models/filters'
import { location } from '../models/location'
import { AuthProvider } from '../providers/auth-provider'


enableProdMode();

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    PagesModule,
    DashboardModule,
    AuthModule,
    ServicesModule,
    IonicModule.forRoot(MyApp, {
      mode: 'md'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Filter, AuthProvider, location, Storage]
})
export class AppModule {}
