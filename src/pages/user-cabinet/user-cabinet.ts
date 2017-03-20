import {Component, OnChanges, SimpleChanges} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth-provider";
import {FormBuilder, Validators} from "@angular/forms";
import {settings} from "../../app/settings/settings";
import _ from "lodash";
import {UserUpdateProvider} from "../../providers/user-update-provider";
import {LengProvider} from "../../providers/leng-provider";
/*
 Generated class for the UserCabinet page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-user-cabinet',
  templateUrl: 'user-cabinet.html'
})
export class UserCabinetPage implements OnChanges {
  private _user_cabinet: any;
  private _leng: any = {};
  usr: any = {};


  private changes: any = {};

  constructor(public navCtrl: NavController,
              private auth: AuthProvider,
              private formBuilder: FormBuilder,
              private leng: LengProvider) {

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes, 111)
  }

  ngAfterContentInit() {
    this._InitPage();
  }

  ionViewDidLoad() {
    this.leng.GetLeng("user_cabinet").then(res => {
      this._leng = _.assign({}, res);
    }).catch(err => {
      this._leng = _.assign({}, err);
    });

  }


  ionViewCanEnter() {
    return !_.isEmpty(this.auth.user)
  }

  private MakeChanges(fld, value) {
    this.usr[fld]!==value?(
        // fld == 'passport_data'?value= btoa(value):false,
        this.changes[fld] = value
      ):false;
  }

  private _InitPage() {
    this.usr = this.auth.Get();

    let p: any = '';
    _.has(this.usr, 'user') ? this.usr = this.usr.user : false;
    // try {
      // this.usr.passport_data = atob(this.usr.passport_data)

    // }
    // catch (err) {

      // console.error("Произошла ошибка", err)
    // }

    this._user_cabinet = this.formBuilder.group({
      first_name: [this.usr.first_name, Validators.required],
      second_name: [this.usr.second_name, Validators.required],
      patronymic: [this.usr.patronymic, Validators.required],
      passport_data: [this.usr.passport_data, Validators.compose([Validators.maxLength(11), Validators.pattern(/[0-9]{4}\s[0-9]{6}/)])]
    })
  }

  private _Change() {
    this._user_cabinet.valid && this._user_cabinet.value.passport_data.length > 0 ? (
        this.usr.passport_data = this._user_cabinet.value.passport_data,
        // this.usr.passport_data = btoa(this._user_cabinet.value.passport_data),
          this.usr.first_name = this._user_cabinet.value.first_name,
          this.usr.second_name = this._user_cabinet.value.second_name,
          this.auth.UpdateUser(this.usr.access_token, this.usr.user_id, this.changes)
            .then(res => {
              this.changes = {};
              this.auth.set("user", this.usr);
              this.auth.updateStorage()
            }).catch(err => {
          })
      ) : false;


    /*


     this.auth.UpdateUser(this.usr.access_token, this.usr.user_id, this.usr)
     .then(res => {
     this.auth.set("user", this.usr);
     this.auth.updateStorage()
     }).catch(err => {
     })
     */


    // this.auth.updateStorage();
    // this.auth.set("passport",this)
    // this.userprovider.UserUpdate(this.auth.user.user_id, '1234 123456', null)
    //   .then(res => {
    //   console.log(res)
    // })
    //   .catch(err => console.error(err));

  }

}
