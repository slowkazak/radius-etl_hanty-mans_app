import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';

import {AuthProvider} from './auth-provider'

import {settings} from "../app/settings/settings";
import {CommonCallback} from "../helpers/common.callback.class";
import _ from "lodash";
@Injectable()
export class PoolsProvider  {
  server: string = 'http://api.admhmansy.ru'
  access_token: string = this.auth.user.access_token || null


  constructor(public http: Http, private auth: AuthProvider) {

  }

  /** Получение списка опросов
   * @constructor
   */
  public GetPollsList() {
    let result = null;
    result = this.http.get(
      settings.adm_domain_path +
      settings.api_methods.votes_list.method)
      .toPromise()
      .then(res => CommonCallback._SuccessCallback(res))
      .catch(err => CommonCallback._ErrorCallback(err))
    return result;
  }

  /**
   * Получение опроса по id
   * @param pollid
   * @returns {null}
   * @constructor
   */
  public GetPoll(pollid = 0) {
    let result = null;
    let urlsearch = null;
    pollid ?

      (() => {
        try {
          urlsearch = new URLSearchParams();
          urlsearch.set(settings.api_methods.vote.data_param, pollid);
          result = this.http.get(
            settings.adm_domain_path +
            settings.api_methods.vote.method, { search: urlsearch })
            .toPromise()
            .then(res => CommonCallback._SuccessCallback(res))
            .catch(err => CommonCallback._ErrorCallback(err))
        }
        catch (err) {
          console.error("Произошла ошибка", err);
          result = Promise.reject(false);
        }

      })()
      : result = Promise.reject(false);
    return result
  }

  public Answer(answerdata){
   let urlsearch = new URLSearchParams();
   _.forEach(answerdata.answers,(item:any)=>{
     try {
     urlsearch.set('vote_'+item.type+'_'+item.q,item.val);
     }
     catch (err) {
       console.error("Произошла ошибка", err)
     }
   });
    urlsearch.set('AJAX_POST',"Y");
    urlsearch.set('vote',"Y");
    urlsearch.set('REVOTE_ID',answerdata.id);
    urlsearch.set('PUBLIC_VOTE_ID',answerdata.id);
    urlsearch.set('PUBLIC_VOTE_ID',answerdata.id);
    urlsearch.set('sessid',answerdata.sessid);

    console.warn(urlsearch.toString())
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    // :Y
    // vote:Y
    // REVOTE_ID:49
    // PUBLIC_VOTE_ID:49
    // VOTE_ID:49
    // sessid:a0d215f701b0b800fc86f601a4776b71
    // vote_radio_116 549


    // q: answer.QUESTION_ID,
    //   a: answer.ANSWER_ID,
    //   type:type,
    //   val:val,
    return this.http.post(settings.adm_domain_path,urlsearch.toString(), {headers: headers}).toPromise()
      .then(res => CommonCallback._SuccessCallback(res))
      .catch(err => CommonCallback._ErrorCallback(err))
  }


  //TODO рефактор
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
