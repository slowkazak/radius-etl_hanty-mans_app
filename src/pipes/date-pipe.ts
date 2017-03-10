import {Pipe, PipeTransform, Injectable} from '@angular/core';

@Pipe({name: 'convertDate'})
@Injectable()
export class ConvertDatePipe implements PipeTransform {
  transform(datetime: any) {

    let date = new Date(datetime.replace(/-/g, "/"));

    let d: any = date.getDate();
    let m:any = date.getMonth() + 1;
    d < 10 ? d = '0' + d : false;
    m < 10 ? m = '0' + m : false;
    return [d, m, date.getFullYear()].join('.')
  }
}
