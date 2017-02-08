import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'convertDate'})
@Injectable()
export class ConvertDatePipe implements PipeTransform {
  transform(datetime: any) {
    console.log('getting date')
    let date = new Date(datetime.replace(/-/g, "/"));
    return [date.getDay(), date.getMonth() + 1, date.getFullYear()].join('.')
  }
}
