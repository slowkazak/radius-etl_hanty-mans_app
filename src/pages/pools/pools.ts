import {Component} from '@angular/core';
import {NavController, LoadingController, NavParams, ToastController} from 'ionic-angular';
import {PoolsProvider} from '../../providers/pools-provider'
import {LengProvider} from "../../providers/leng-provider";
import _ from "lodash";
import {PollComponent} from "../../components/poll/poll";
@Component({
  selector: 'page-pools',
  templateUrl: 'pools.html',
  providers: [PoolsProvider]
})
export class PoolsPage {
  data: any
  title: string = 'Опросы';
  stats: Array<any> = [];

  private _leng: any = {};
  private _pollslist: any = [];
  private _pollclicked = false;
  private _pollid = 0;
  private _isvoted: boolean = false;

  constructor(public navCtrl: NavController,
              public poolsProvider: PoolsProvider,
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              private leng: LengProvider) {
  }


  /**
   * Получение списка опросов
   * @private
   */
  private _GetPollsList() {
    let loader = this.loadingCtrl.create({
      content: 'Пожалуйста, подождите'
    });
    loader.present();
    let date = new Date().getTime();
    this.poolsProvider.GetPollsList().then(res => {

      !_.isEmpty(res) ? _.forEach(res, ((item: any) => {
        try {

          item.EVENT3 === 'Y' ? item.EVENT3 = true : item.EVENT3 = false;
          item.LAMP == "green" ? item.LAMP = true : item.LAMP = false;
          item.LAMP ? item.EVENT3 ? (console.log(item),this._pollslist.push(item)) : false : false;
        }
        catch (err) {
          console.error("Произошла ошибка", err)
        }

      })) : false;

      loader.dismiss();
    }).catch(err => {
      loader.dismiss();
    })
  }

  private _ShowPoll(id, isvoted) {
    // !this._pollclicked ?
    //   _.forEach(document.getElementsByClassName('poll_list'), (item: any) => {
    //     _.indexOf(item.classList, 'activated') > -1 ? item.classList.remove('activated') : item.classList.add('hidden')
    //   }) :
    //   _.forEach(document.getElementsByClassName('poll_list'), (item: any) => {
    //     item.classList.remove('hidden')
    //   });
    this._pollclicked = !this._pollclicked;
    this._pollid = id;
    isvoted === "N" ? this._isvoted = false : this._isvoted = true

    this.navCtrl.push(PollComponent, {id: this._pollid, isvoted: this._isvoted})

  }


  ionViewDidLoad() {
    this._GetPollsList();
    this.leng.GetLeng("polls").then(res => {
      this._leng = _.assign({}, res);
    }).catch(err => {
      this._leng = _.assign({}, err);
    });

    //
    //
    // //TODO Переделать
    // let loader = this.loadingCtrl.create({
    //   content: 'Пожалуйста, подождите'
    // })
    // loader.present()
    // if (this.navParams.data.question) {
    //   this.poolsProvider.getAnswers(this.navParams.data.question).subscribe(res => {
    //     console.log(res.json());
    //     this.data = res.json();
    //     this.title = this.navParams.data.question.label;
    //     loader.dismiss()
    //   }, err => {
    //     console.log(err.json());
    //     loader.dismiss()
    //   })
    // } else if (this.navParams.data.pool) {
    //   this.poolsProvider.getQuestions(this.navParams.data.pool).subscribe(res => {
    //     console.log(res.json());
    //     this.data = res.json();
    //     this.title = this.navParams.data.pool.label
    //     loader.dismiss()
    //   }, err => {
    //     console.log(err.json());
    //     loader.dismiss()
    //   })
    // } else {
    //   this.poolsProvider.get().subscribe(res => {
    //     console.log(res.json());
    //     this.data = res.json();
    //     loader.dismiss()
    //   }, err => {
    //     console.log(err.json());
    //     loader.dismiss()
    //   })
    // }
    // console.log('Hello PoolsPage Page');
  }

  // openItem(item: any) {
  //   if (item.answer_id) this.answer(item);
  //   else if (this.navParams.data.pool) {
  //     this.navCtrl.push(PoolsPage, {question: item})
  //   } else {
  //     this.navCtrl.push(PoolsPage, {pool: item})
  //   }
  // }
  //
  // answer(item: any) {
  //   let loader = this.loadingCtrl.create({
  //     content: 'Пожалуйста, подождите'
  //   })
  //   loader.present()
  //   this.poolsProvider.sendAnswer(item).subscribe(res => {
  //     console.log(res.json())
  //     this.stats = res.json().stats
  //     loader.dismiss()
  //     let toast = this.toastCtrl.create({
  //       message: 'Ответ отправлен',
  //       duration: 3000
  //     })
  //     toast.present()
  //     // this.navCtrl.popToRoot()
  //   }, err => {
  //     loader.dismiss()
  //     let toast = this.toastCtrl.create({
  //       message: 'Произошла ошибка',
  //       duration: 3000
  //     })
  //     toast.present()
  //   })
  // }

}
