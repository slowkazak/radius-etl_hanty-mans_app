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

  constructor(public navCtrl: NavController,
              private auth: AuthProvider,
              private formBuilder: FormBuilder,
              private leng:LengProvider,
              private userprovider: UserUpdateProvider) {

  }

  ngOnChanges(changes) {
    console.log(changes)
  }

  ngAfterContentInit() {
    this._InitPage();
    console.info(atob(this.auth.user.password_hash))
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
    this._user_cabinet = this.formBuilder.group({
      first_name: [this.auth.user.first_name, Validators.required],
      second_name: [this.auth.user.second_name, Validators.required],
      login: [this.auth.user.login, Validators.required],
      password: [this.auth.user.password_hash, Validators.required],
      passport: ['', Validators.compose([Validators.maxLength(11),
        Validators.minLength(11)])]
    })
  }

  private _Change() {
    console.info(this._user_cabinet.value.passport)
    this._user_cabinet.valid && this._user_cabinet.value.passport.length > 0 ? this.auth.set("passport", btoa(this._user_cabinet.value.passport)) : false
    // this.auth.set("passport",this)
    // this.userprovider.UserUpdate(this.auth.user.user_id, '1234 123456', null)
    //   .then(res => {
    //   console.log(res)
    // })
    //   .catch(err => console.error(err));

  }

}
