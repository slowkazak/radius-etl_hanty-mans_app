import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {PoolsProvider} from "../../providers/pools-provider";
import _ from "lodash";
import {NavParams, NavController} from "ionic-angular";
import {CommonToast} from "../../helpers/toast.class";
import {PoolsPage} from "../../pages/pools/pools";
/*
 Generated class for the Poll component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
  selector: 'poll',
  templateUrl: 'poll.html',

  providers: [PoolsProvider]
})
export class PollComponent {
  pollid = 0;
  isvoted: boolean = false;
  text: string;
  private _isready: boolean = false;
  private _answersready: boolean = false;
  private questions_length = 0;

  private _questions: any = [];
  private _answerdata: any = {answers: []};

  constructor(private poolsProvider: PoolsProvider, private navCtrl:NavController,private navparams: NavParams) {
    this.text = 'Hello World';
  }


  ngAfterContentInit() {
    this._answerdata.id = this.navparams.get('id');
    this.pollid = this.navparams.get('id');
    this.isvoted = this.navparams.get('isvoted');

    this._GetPoll();
  }

  /**
   * Получение данных опроса, переработка исходных данных к удобному для парсинга виду
   * @private
   */
  private _GetPoll() {
    this.poolsProvider.GetPoll(this.pollid)
      .then(res => {
        this._answerdata.sessid = res.sessid;
        let regex = /(<([^>]+)>)/ig;
        res && _.has(res, "questions_id") && res.questions_id.length > 0 ?
          _.forEach(res.questions_id, (item) => {
            try {
              this.questions_length = res.questions_id.length;

              res.vote.CHANNEL_USE_CAPTCHA === "N" ?
                (
                  res.questions[item].QUESTION = res.questions[item].QUESTION.replace(regex, ""),
                    res.questions[item]._answers = [],
                    _.forEach(res.questions[item].ANSWERS, (answer) => {
                      answer.value = null;
                      this._answerdata[answer.QUESTION_ID] = [];
                      res.questions[item]._answers.push(answer);
                      console.info(res.questions[item]._answers)
                    }),
                    this._questions.push(res.questions[item])
                )
                : false
            }
            catch (err) {
              console.error("Произошла ошибка", err)
            }
          })

          : false;

        this._isready = true;
      }).catch(err => {
      this._isready = true;
      console.error(err)
    })
  }

  private _Answer() {
    this.poolsProvider.Answer(this._answerdata).then(res => {
      this.isvoted = true;
      console.info(res)
      CommonToast.ShowToast('Ваш ответ принят, спасибо');
      this.navCtrl.push(PoolsPage);
    }).catch(err => console.error(err));
  }

  /**
   * Подготовка данных ответов
   * @param answer
   * @private
   */
  private _PrepareAnswer(answer = null, type) {

    if (!this.isvoted) {
      let _callback = (type, value = null) => {
        let val = null;
        let idx: any = -1;
        value ? val = value : val = answer.ANSWER_ID;
        idx = _.findIndex(this._answerdata.answers, function (o: any) {
          return (o.q == answer.QUESTION_ID && o.a == answer.ANSWER_ID)
        });
        console.info(idx);


        if (type === "checkbox") {
          this._answerdata.answers = _.filter(this._answerdata.answers, function (o: any) {
            return o.a !== answer.ANSWER_ID
          });
          if (idx < 0) {
            this._answerdata.answers.push(
              {
                q: answer.QUESTION_ID,
                a: answer.ANSWER_ID,
                type: type,
                val: val,
                raw: 'vote_' + type + '_' + answer.QUESTION_ID + ': ' + val
              }
            );
          }
          idx = -1;
        }
        else {

          this._answerdata.answers = _.filter(this._answerdata.answers, function (o: any) {
            return (o.q !== answer.QUESTION_ID && o.a !== answer.ANSWER_ID)
          });
          this._answerdata.answers.push(
            {
              q: answer.QUESTION_ID,
              a: answer.ANSWER_ID,
              type: type,
              val: val,
              raw: 'vote_' + type + '_' + answer.QUESTION_ID + ': ' + val
            }
          );
        }


      };
      switch (answer.FIELD_TYPE) {
        case '0':
          _callback('radio');
          break;
        case '1':
          _callback('checkbox');
          break;
        case '5':
          _callback('memo', answer.value);
          break;
      }
      let ans = _.uniqBy(this._answerdata.answers, 'q');

      ans.length>=this.questions_length? this._answersready = true:this._answersready = false;

    }
  }
}
