import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mailto'
})
export class MailtoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return `mailto:${value}`;
  }
}
