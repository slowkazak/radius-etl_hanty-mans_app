import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';


import {ReactiveFormsModule, FormsModule} from '@angular/forms'
import {MfcProvider} from "./providers/mfc";
import {MfcServicesPage} from "./pages/mfc-service/mfc-service";
import {MfcIndexPage} from "./pages/mfc-index/mfc-index";
import {IonicModule} from "ionic-angular";
import {CommonCallback} from "./classes/common.callback.class";
import {MfcDatePage} from "./pages/mfc-date/mfc-date";
import {MfcTimePage} from "./pages/mfc-time/mfc-time";
import {OrderPopoverPage} from "./pages/order-popover/order-popover";
import { getDatePipe1, getMonthPipe1 } from '../pipes/get-date';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    IonicModule.forRoot(MfcIndexPage, {}, {
      links: [
        { component: MfcServicesPage, name: 'Services', segment: 'services/:subservice' },
        { component: MfcDatePage, name: 'Date', segment: 'service/:productId' },
        { component: MfcTimePage, name: 'Time', segment: 'servicetime/:time' }
      ]
    }),
    ReactiveFormsModule
  ],
  entryComponents:[
    MfcServicesPage,
    MfcDatePage,
    MfcTimePage,
    OrderPopoverPage
  ],
  declarations: [
    MfcIndexPage,
    MfcServicesPage,
    MfcDatePage,
    MfcTimePage,
    OrderPopoverPage,
    getDatePipe1,
    getMonthPipe1
  ],
  exports: [MfcIndexPage,
    // getDatePipe,
    // getMonthPipe
  ],
  providers: [MfcProvider,CommonCallback]
})
export class MfcModule {
}
