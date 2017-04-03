import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Validators, FormBuilder} from "@angular/forms";
import {MfcProvider} from "../../providers/mfc";
import _ from "lodash";
import {CommonToast} from "../../classes/toast.class";
import {AuthProvider} from "../../../providers/auth-provider";
/*
 Generated class for the OrderPopover page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-order-popover',
  templateUrl: 'order-popover.html'
})
export class OrderPopoverPage {
  login_form: any;
  second_name: any = '';
  steps = {step1: false, steps2: false};
  bookresult = {};

  user: any = null;

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private mfcserv: MfcProvider,
              private auth: AuthProvider) {
    this.login_form = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngAfterContentInit() {
    this.user = this.auth.Get();
    try {
      _.has(this.user, 'user') ? this.second_name = this.user.user.second_name : this.second_name = '';
    }
    catch (err) {
      this.second_name = '';
      console.error("Произошла ошибка", err)
    }
  }

  private TryOrder(skip = false) {
    let usr = {login: this.login_form.value.login, pass: this.login_form.value.password}
    skip ? usr = {login: null, pass: null} : false
    this.mfcserv.TryLogin(usr.login, usr.pass).then(res => {
        this.steps.step1 = true;
      }
    ).catch((err) => {
      CommonToast.ShowToast(err);
    });
  }

  private TryBook() {
    let data = this.navParams.get('data');
    data.second_name = this.second_name;
    this.mfcserv.TryBook(data).then((res: any) => {
      res.Products.length > 0 ? _.forEach(res.Products, (item) => {
          let d = new Date(item.StartTime);
          let m: any = d.getMonth()+1;
          let mm: any = d.getMinutes();
          mm < 10 ? mm = mm + '0' : false;
          item.readable_date = d.getDate() + '.' + m + '.' + d.getFullYear() + ' (' + d.getUTCHours() + ':' + mm + ')'
        }) : false;
      _.assign(this.bookresult, res);
      this.steps.steps2 = true;
    }).catch((err) => {
      this.viewCtrl.dismiss();
      CommonToast.ShowToast('Произошла ошибка при записи, попробуйте позже');
      this.steps.steps2 = true;
    });
  }

  private Close() {
    this.viewCtrl.dismiss();
  }
}

