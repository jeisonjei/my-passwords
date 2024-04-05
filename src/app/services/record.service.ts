import { Injectable } from '@angular/core';
import { RecordItem } from '../models/interfaces';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  constructor() { }
  signal$ = new Subject();
  list() {
    return JSON.parse(localStorage.getItem('records')) || [];
  }
  addSingle(record: RecordItem) {
    var records = this.list();
    records.push(record);
    localStorage.setItem('records', JSON.stringify(records));

    this.signal$.next(records);
    
    return records;
  }
  addArray(recordsArray: RecordItem[]) {
    var records = this.list();
    records = records.concat(recordsArray);
    localStorage.setItem('records', JSON.stringify(records));

    this.signal$.next(records);
    
    return records;
  }
  delete(record: RecordItem) {
    var records = this.list();
    var index = records.map(rec=>rec.id).indexOf(record.id);
    if (index > -1) {
      records = [...records.slice(0, index),...records.slice(index + 1)];
    } else {
      console.log('Record not found');
    }
    localStorage.setItem('records', JSON.stringify(records));

    this.signal$.next(records);

    return records;
    
  }
  deleteAll() {
    var records = [];
    localStorage.setItem('records', JSON.stringify(records));
    this.signal$.next(records);
  }
}
