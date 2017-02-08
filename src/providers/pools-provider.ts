import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthProvider } from './auth-provider'

@Injectable()
export class PoolsProvider {
  server: string = 'http://api.admhmansy.ru'
  access_token: string = this.auth.user.access_token || null

  constructor(public http: Http, private auth: AuthProvider) {
    console.log('Hello Pools Provider');
  }

  get() {
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded')
    let params = new URLSearchParams()
    params.set('access_token', this.access_token)
    let body = params.toString()
    return this.http.post(this.server + '/polls/activepolls', body, {headers: headers})
  }

  getQuestions(item: any) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded')
    let params = new URLSearchParams()
    params.set('access_token', this.access_token)
    params.set('test_id', item.test_id)
    let body = params.toString()
    return this.http.post(this.server + '/polls/questions', body, {headers: headers})
  }

  getAnswers(item: any) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded')
    let params = new URLSearchParams()
    params.set('access_token', this.access_token)
    params.set('question_id', item.question_id)
    let body = params.toString()
    return this.http.post(this.server + '/polls/answers', body, {headers: headers})
  }

  sendAnswer(item: any) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded')
    let params = new URLSearchParams()
    params.set('access_token', this.access_token)
    params.set('answer_id', item.answer_id)
    let body = params.toString()
    return this.http.post(this.server + '/polls/answer', body, {headers: headers})
  }

}
