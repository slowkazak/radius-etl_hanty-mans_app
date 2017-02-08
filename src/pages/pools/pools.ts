import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, ToastController } from 'ionic-angular';
import { PoolsProvider } from '../../providers/pools-provider'

@Component({
  selector: 'page-pools',
  templateUrl: 'pools.html',
  providers: [PoolsProvider]
})
export class PoolsPage {
  data: any
  title: string = 'Опросы'
  stats: Array<any> = []

  constructor(public navCtrl: NavController, public poolsProvider: PoolsProvider, public loadingCtrl: LoadingController, public navParams: NavParams, public toastCtrl: ToastController) {}

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: 'Пожалуйста, подождите'
    })
    loader.present()
    if (this.navParams.data.question) {
      this.poolsProvider.getAnswers(this.navParams.data.question).subscribe(res => {
        console.log(res.json())
        this.data = res.json()
        this.title = this.navParams.data.question.label
        loader.dismiss()
      }, err => {
        console.log(err.json())
        loader.dismiss()
      })
    } else if (this.navParams.data.pool) {
      this.poolsProvider.getQuestions(this.navParams.data.pool).subscribe(res => {
        console.log(res.json())
        this.data = res.json()
        this.title = this.navParams.data.pool.label
        loader.dismiss()
      }, err => {
        console.log(err.json())
        loader.dismiss()
      })
    } else {
      this.poolsProvider.get().subscribe(res => {
        console.log(res.json())
        this.data = res.json()
        loader.dismiss()
      }, err => {
        console.log(err.json())
        loader.dismiss()
      })
    }
    console.log('Hello PoolsPage Page');
  }

  openItem(item: any) {
    if (item.answer_id) this.answer(item)
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
