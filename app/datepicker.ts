import {Component,Injectable} from '@angular/core';
import {NgbCalendar, NgbDate, NgbDateStruct, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

export function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}
@Injectable()
export class MyFormatter extends NgbDateParserFormatter {

  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('-');
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return { year: toInteger(dateParts[0]), month: null, day: null };
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null };
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2]) };
      }
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    return date ?
      `${isNumber(date.day) ? padNumber(date.day) : ''}-${isNumber(date.month) ? padNumber(date.month) : ''}-${date.year}` :
      '';
  }

}

@Component({
  selector: 'ngbd-datepicker',
  templateUrl: './datepicker.html',
  providers: [{ provide: NgbDateParserFormatter, useClass: MyFormatter }]
})
export class NgbdDatepicker {
  model;

  constructor(private calendar: NgbCalendar) {
  }

  isAvailable = (date: NgbDate) => this.calendar.getWeekday(date) > 5;
  isUnavailable = (date: NgbDate) => date.equals(this.calendar.getNext(this.calendar.getToday()));
  isToday = (date: NgbDate) => date.equals(this.calendar.getToday());
}

@Component({
  selector: 'ngbd-datepicker-single',
  templateUrl: './datepicker-single.html',
  providers: [{ provide: NgbDateParserFormatter, useClass: MyFormatter }]
})
export class NgbdDatepickerSingle {
  model;

  constructor(private calendar: NgbCalendar) {
    this.model = calendar.getToday();
  }

  isAvailable = (date: NgbDate) => this.calendar.getWeekday(date) > 5;
  isUnavailable = (date: NgbDate) => date.equals(this.calendar.getNext(this.calendar.getToday()));
  isToday = (date: NgbDate) => date.equals(this.calendar.getToday());
}

@Component({
  selector: 'ngbd-datepicker-range',
  templateUrl: './datepicker-range.html',
  providers: [{ provide: NgbDateParserFormatter, useClass: MyFormatter }]
})
export class NgbdDatepickerRange {
  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;

  constructor(private calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 7);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isToday = (date: NgbDate) => date.equals(this.calendar.getToday());

  isHovered = (date: NgbDate) => this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);

  isInside = (date: NgbDate) => date.after(this.fromDate) && date.before(this.toDate);

  isRange = (date: NgbDate) => date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);

  isStartRange = (date: NgbDate) => date.equals(this.fromDate);

  isEndRange = (date: NgbDate) => date.equals(this.toDate);
  
  isHoveredEndRange = (date: NgbDate) => this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate)
}