import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {PoolsProvider} from "../../providers/pools-provider";
import _ from "lodash";
/*
 Generated class for the Poll component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
  selector: 'poll',
  templateUrl: 'poll.html'
})
export class PollComponent implements OnChanges {
  @Input() pollid = 0;
  @Input() isvoted: string = '';
  text: string;
  private _isready: boolean = false;
  private _answersready:boolean = false;
  private _questions: any = [];
  private _answerdata: any = {answers: []};

  constructor(private poolsProvider: PoolsProvider,) {
    this.text = 'Hello World';
  }

  ngOnChanges(changes: SimpleChanges) {
    this._answerdata.id = this.pollid;

    this._GetPoll();
  }

  ngAfterContentInit() {
    // this._GetPoll();
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

              res.vote.CHANNEL_USE_CAPTCHA === "N" ?
                (
                  res.questions[item].QUESTION = res.questions[item].QUESTION.replace(regex, ""),
                    res.questions[item]._answers = [],
                    _.forEach(res.questions[item].ANSWERS, (answer) => {
                      answer.value = null;
                      res.questions[item]._answers.push(answer);
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
    console.info(this._questions)
  }

  private _Answer() {
    this.poolsProvider.Answer(this._answerdata).then(res => console.info(res)).catch(err => console.error(err));
  }

  /**
   * Подготовка данных ответов
   * @param answer
   * @private
   */
  private _PrepareAnswer(answer) {
    if (this.isvoted === 'N') {
      let _callback = (type, value = null) => {
        let val = null;
        value ? val = value : val = answer.ANSWER_ID;
        this._answerdata.answers.length ?
          this._answerdata.answers = _.filter(this._answerdata.answers, (item: any) => {
            let result = false;
            item.q !== answer.QUESTION_ID && item.a !== answer.ANSWER_ID ? result = true : false;
            return result
          })
          : false;
        this._answerdata.answers.push(
          {
            q: answer.QUESTION_ID,
            a: answer.ANSWER_ID,
            type: type,
            val: val,
            raw: 'vote_' + type + '_' + answer.QUESTION_ID + ': ' + val
          }
        );



    };
      switch (answer.FIELD_TYPE) {
        case '0':
          _callback('radio');
          break;
        case '5':
          _callback('memo', answer.value);
          break;
      }

    }
  }
}
