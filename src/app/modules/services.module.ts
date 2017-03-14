import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
// import { ServicesPage } from '../../pages/services/services';
// import { ServiceDatePage } from '../../pages/service-date/service-date';
// import { ServiceHoursPage } from '../../pages/service-hours/service-hours';
import { OmsPage } from '../../pages/oms-page/oms-page';
import { OmsTimePage } from '../../pages/oms-time/oms-time';
import { OmsBookPage } from '../../pages/oms-book/oms-book';
import{ OmsBookFormPage } from '../../pages/oms-book-form/oms-book-form';
import {OmsDatePage} from "../../pages/oms-date/oms-date";
import { getDatePipe, getMonthPipe } from '../../pipes/get-date';




@NgModule({
  imports: [
    // IonicModule.forRoot(ServicesPage),
    // IonicModule.forRoot(ServiceDatePage),
    // IonicModule.forRoot(ServiceHoursPage),
    IonicModule.forRoot(OmsPage),
    IonicModule.forRoot(OmsDatePage),
    IonicModule.forRoot(OmsTimePage),
    IonicModule.forRoot(OmsBookPage),
    IonicModule.forRoot(OmsBookFormPage)
  ],
  declarations: [
    // ServicesPage,
    // ServiceDatePage,
    // ServiceHoursPage,
    getDatePipe,
    getMonthPipe,
    OmsPage,
    OmsDatePage,
    OmsTimePage,
    OmsBookPage,
    OmsBookFormPage,
  ],
  exports: [
    // ServicesPage,
    // ServiceDatePage,
    // ServiceHoursPage,
    OmsPage,
    OmsDatePage,
    OmsTimePage,
    OmsBookPage,
    OmsBookFormPage
  ]
})
export class ServicesModule {}
