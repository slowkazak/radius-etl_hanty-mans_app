import {Component, OnChanges} from '@angular/core';
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

  constructor(public navCtrl: NavController,
              private auth: AuthProvider,
              private formBuilder: FormBuilder,
              private leng: LengProvider,
              private userprovider: UserUpdateProvider) {

  }

  ngOnChanges(changes) {
    console.log(changes)
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

  private _InitPage() {
    this.usr = this.auth.Get();
    let p = '';
    _.has(this.usr, 'user') ? this.usr = this.usr.user : false;
    _.has(this.usr, 'passport') ? p= atob(this.usr.passport) : false;
    this._user_cabinet = this.formBuilder.group({
      first_name: [this.usr.first_name, Validators.required],
      second_name: [this.usr.second_name, Validators.required],
      passport: [p, Validators.compose([Validators.maxLength(11),
        Validators.minLength(10)])]
    })
  }

  private _Change() {
    this._user_cabinet.valid && this._user_cabinet.value.passport.length > 0 ? (
        this.usr.passport = btoa(this._user_cabinet.value.passport),
        this.usr.first_name = this._user_cabinet.value.first_name,
        this.usr.second_name = this._user_cabinet.value.second_name,
          this.auth.set("user", this.usr),
      console.log(this.usr)) : false;
        this.auth.updateStorage()
    // this.auth.set("passport",this)
    // this.userprovider.UserUpdate(this.auth.user.user_id, '1234 123456', null)
    //   .then(res => {
    //   console.log(res)
    // })
    //   .catch(err => console.error(err));

  }

}
