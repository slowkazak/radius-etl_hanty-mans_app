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
  private _isvoted = '';

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

      !_.isEmpty(res) ? _.map(res, ((item: any) => {
          try {
            // преобразование даты к mm-dd-yyy hh:mm:ss
            let t = item.DATE_END.split(/[- : .]/);
            // item.DATE_END = item.DATE_END.split(".");
            item.DATE_END = Math.abs(new Date(t[0], t[1], t[2]).getTime());
            //текущай дата меньше Date_end - показывать голосование

            console.log(item.DATE_END, date);

            item.DATE_END > date ? this._pollslist.push(item) : false;
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

  private _ShowPoll(id,isvoted) {
    // !this._pollclicked ?
    //   _.forEach(document.getElementsByClassName('poll_list'), (item: any) => {
    //     _.indexOf(item.classList, 'activated') > -1 ? item.classList.remove('activated') : item.classList.add('hidden')
    //   }) :
    //   _.forEach(document.getElementsByClassName('poll_list'), (item: any) => {
    //     item.classList.remove('hidden')
    //   });
    this._pollclicked = !this._pollclicked;
    this._pollid = id;
this._isvoted = isvoted;
console.info(id, this._isvoted);
this.navCtrl.push(PollComponent,{id:this._pollid,isvoted:this._isvoted})

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

  openItem(item: any) {
    if (item.answer_id) this.answer(item);
    else if (this.navParams.data.pool) {
      this.navCtrl.push(PoolsPage, {question: item})
    } else {
      this.navCtrl.push(PoolsPage, {pool: item})
    }
  }

  answer(item: any) {
    let loader = this.loadingCtrl.create({
      content: 'Пожалуйста, подождите'
    })
    loader.present()
    this.poolsProvider.sendAnswer(item).subscribe(res => {
      console.log(res.json())
      this.stats = res.json().stats
      loader.dismiss()
      let toast = this.toastCtrl.create({
        message: 'Ответ отправлен',
        duration: 3000
      })
      toast.present()
      // this.navCtrl.popToRoot()
    }, err => {
      loader.dismiss()
      let toast = this.toastCtrl.create({
        message: 'Произошла ошибка',
        duration: 3000
      })
      toast.present()
    })
  }

}
