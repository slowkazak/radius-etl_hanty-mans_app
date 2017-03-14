import { Pipe, PipeTransform, Injectable } from '@angular/core';
import moment from 'moment'

@Pipe({ name: 'getDateTime'})
@Injectable()
export class getDatePipe implements PipeTransform {
  transform(day: any, month: any, year: any) {
    moment.locale('ru');
    let date = moment(year+ '/' + month + '/' + day, "YYYY/MM/DD");
    return date.format('DD MMMM');
  }
}

@Pipe({ name: 'getMonthName'})
@Injectable()
export class getMonthPipe implements PipeTransform {
  transform(year: any, month: any) {
    console.info(year, month)
    moment.locale('ru');
    // let test = moment(year + "-" + month, "YYYY-MM")
    // console.log(test.format('MMMM YYYY'))
    // let date = new Date(year + '/' + month)
    // let options = {
    //   month: 'long'
    // };
    // date.toLocaleString('ru', options)
    // let name = date.toLocaleString('ru', options)
    // name = name[0].toUpperCase() + name.slice(1)
    return moment(year + "-" + month, "YYYY-MM").format('MMMM');
  }
}



@Pipe({ name: 'getDateTime1'})
@Injectable()
export class getDatePipe1 implements PipeTransform {
  transform(day: any, month: any, year: any) {
    moment.locale('ru');
    let date = moment(year+ '/' + month + '/' + day, "YYYY/MM/DD");
    return date.format('DD MMMM');
  }
}

@Pipe({ name: 'getMonthName1'})
@Injectable()
export class getMonthPipe1 implements PipeTransform {
  transform(year: any, month: any) {
    console.info(year, month)
    moment.locale('ru');
    // let test = moment(year + "-" + month, "YYYY-MM")
    // console.log(test.format('MMMM YYYY'))
    // let date = new Date(year + '/' + month)
    // let options = {
    //   month: 'long'
    // };
    // date.toLocaleString('ru', options)
    // let name = date.toLocaleString('ru', options)
    // name = name[0].toUpperCase() + name.slice(1)
    return moment(year + "-" + month, "YYYY-MM").format('MMMM');
  }
}
