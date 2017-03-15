import { Component, Pipe, PipeTransform } from '@angular/core';
import { NavController, LoadingController, ModalController, PopoverController } from 'ionic-angular';
import { ObjectsService } from '../../providers/objects-service'
import { ObjectsFiltersPage } from '../objects-filters/objects-filters'
import { ObjectsStatusPage } from '../objects-status/objects-status';
import { ObjectDetailPage } from '../object-detail/object-detail';
import { ObjectAddPage } from '../object-add/object-add'
import { UserObjectsPage } from '../user-objects/user-objects'
import { Filter } from '../../models/filters'
import { ConvertDatePipe } from '../../pipes/date-pipe'
import { AuthProvider } from '../../providers/auth-provider'



import {LengProvider} from "../../providers/leng-provider";
import _ from "lodash";


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  providers: [ObjectsService]
})

export class DashboardPage {
  data: Array<any>;
  full_data: Array<any> = [];
  loading: any;
  checkbox: Filter;
  UserObjectsPage = UserObjectsPage;
  searchBar: string = '';
  processed_data: any;

  private _leng:any = {};
  constructor(
    private leng:LengProvider,

    public navCtrl: NavController,
    public ObjectsService: ObjectsService,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public Filter: Filter,
    public popoverCtrl: PopoverController,
    public auth: AuthProvider
  )
    {
      this.checkbox = this.Filter;
      this.loading = this.loadingCtrl.create({
        content: 'Пожалуйста, подождите'
      });
    }
  showFilters() {
    let curFilters = this.checkbox.toString();
    console.log('current values is:', curFilters)
    let profileModal = this.modalCtrl.create(ObjectsFiltersPage);
    profileModal.onDidDismiss(() => {
      console.log('closed!!')
      // console.log(curFilters)
      // console.log(this.checkbox)
      this.loading = this.loadingCtrl.create({
        content: 'Пожалуйста, подождите'
      });
      this.loadData()
    });
    profileModal.present();
  }

  openStatusChange() {
    let profileModal = this.modalCtrl.create(ObjectsStatusPage);
    profileModal.onDidDismiss(() => {

      this.loading = this.loadingCtrl.create({
        content: 'Пожалуйста, подождите'
      });
      this.loadData()
    });
    profileModal.present();
  }

  cutItems(data: any) {
    this.data = [];
    for (var i = 0; i < 5; i++) {
      if (data[i]) this.data.push(data[i])
    }
    // console.log(this.data)
    this.ObjectsService.set(this.data)
  }

  loadData() {
    this.loading.present();
    this.ObjectsService.load(this.checkbox).subscribe(res => {


      // получаем результаты запросы по объектам
      this.full_data = this.ObjectsService.transform(res ? res.json() : {});
      this.cutItems(this.full_data)
      this.loading.dismiss()
    }, err => {
      // TODO обработку ошибоу
      console.log(err)
      this.loading.dismiss()
    })
  }

  openObject(object: any) {
    this.navCtrl.push(ObjectDetailPage, object)
  }

  addObject() {
    this.navCtrl.push(ObjectAddPage)
    // let ObjectAddModal = this.modalCtrl.create(ObjectAddPage);
    // ObjectAddModal.present();
  }

  doInfinite(infiniteScroll) {
    let data = this.full_data
    console.log(this.searchBar)
    if (this.searchBar) {
      data = this.processed_data
      // infiniteScroll.complete()
      // return false
    }

    let length = this.data.length
    if (length === data.length) {
      infiniteScroll.complete()
      return
    }
    setTimeout(() => {
      let check = (data.length - length) >= 5 ? 5 : (data.length - length)
      console.log(length, check)
      for (var i = 0; i < check; i++) {
        this.data.push(data[length + i])
      }
      // console.log(this.data)
      infiniteScroll.complete()
    }, 500)
  }

  presentPopover() {
    let popover = this.popoverCtrl.create(ObjectsFiltersPage);
    popover.present();
  }

  getDate(item_date: string) {
    console.log('getting date')
    let date = new Date(item_date.replace(/-/g, "/"));
    return [date.getDay(), date.getMonth() + 1, date.getFullYear()].join('.')
  }

  getItems(event: any) {
    let processed_data = this.full_data
    let val = event.target.value
    // if (val == '') {
    //   this.cutItems(this.full_data)
    //   return false
    // }
    if (val && val.trim() != '') {
      processed_data = this.full_data.filter((item) => {
        return (item.User_Message.toLowerCase().indexOf(val.toLowerCase()) > -1)
      })
    }
    // if (processed_data.length === 0) processed_data.push({})
    this.processed_data = processed_data
    // this.data = processed_data
    this.cutItems(processed_data)
    // console.log(event.target.value)
  }

  ionViewDidLoad() {
    this.Filter.Get();
    this.loadData();
    this.leng.GetLeng("dashboard").then(res => {
      this._leng = _.assign({}, res);
    }).catch(err => {
      this._leng = _.assign({}, err);
    });


  }
}
