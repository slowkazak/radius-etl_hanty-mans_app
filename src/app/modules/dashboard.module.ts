import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { ObjectsFiltersPage } from '../../pages/objects-filters/objects-filters';
import { ObjectDetailPage } from '../../pages/object-detail/object-detail';
import { ObjectsStatusPage } from '../../pages/objects-status/objects-status';
import { ObjectAddPage } from '../../pages/object-add/object-add'
import { UserObjectsPage } from '../../pages/user-objects/user-objects'
import { LocationSelectPage } from '../../pages/location-select/location-select'
import { ConvertDatePipe } from '../../pipes/date-pipe'

@NgModule({
  imports: [
    IonicModule.forRoot(DashboardPage),
    IonicModule.forRoot(ObjectsFiltersPage),
    IonicModule.forRoot(ObjectDetailPage),
    IonicModule.forRoot(ObjectsStatusPage),
    IonicModule.forRoot(ObjectAddPage),
    IonicModule.forRoot(UserObjectsPage),
    IonicModule.forRoot(LocationSelectPage)
  ],
  declarations: [
    DashboardPage,
    ObjectsFiltersPage,
    ObjectDetailPage,
    ObjectsStatusPage,
    ObjectAddPage,
    UserObjectsPage,
    LocationSelectPage,
    ConvertDatePipe
  ],
  exports: [
    DashboardPage,
    ObjectsFiltersPage,
    ObjectDetailPage,
    ObjectsStatusPage,
    ObjectAddPage,
    UserObjectsPage,
    LocationSelectPage
  ]
})
export class DashboardModule {}
