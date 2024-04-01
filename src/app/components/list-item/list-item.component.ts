import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RecordItem } from '../../models/interfaces';
import { RecordService } from '../../services/record.service';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.css'
})
export class ListItemComponent {
  constructor(private recordService: RecordService) { }
  
  deleteRecord() {
    this.recordService.delete(this.recordItem);
  }
  @Input() recordItem: RecordItem;

}
