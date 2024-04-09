import { AfterViewChecked, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RecordItem } from '../../models/interfaces';
import { RecordService } from '../../services/record.service';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.css'
})
export class ListItemComponent implements OnInit, OnChanges {
  copied = false;
  copy(arg0: string) {
    navigator.clipboard.writeText(arg0);
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 2000);
  }
  constructor(private recordService: RecordService) { }
  ngOnChanges(changes: SimpleChanges): void {
    
    var source = this.recordItem.url.split(' ');
    var copy = Array.from(source);
    if (copy.length > 1) {
      if (copy.some(s => this.isLink(s))) {
        let link = copy.find(s => this.isLink(s));
        this.parsedUrl.link = link;

        let text = copy.filter(s => !this.isLink(s));
        this.parsedUrl.text = text.join(' ');
      }
      else {
        this.parsedUrl.text = copy.join(' ');
      }
    }
    else {
      if (this.isLink(this.recordItem.url)) {
        this.parsedUrl.link = this.recordItem.url;
      }
      else {
        
        this.parsedUrl.text = this.recordItem.url;
      }
    }
    

  }

  ngOnInit(): void {
  }

  deleteRecord() {
    this.recordService.delete(this.recordItem);
  }
  @Input() recordItem: RecordItem;
  parsedUrl = {
    link: '',
    text: ''
  };
  isLink(str) {
    // Regular expression to match URLs
    var urlPattern = /^(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

    // Check if the string matches the URL pattern
    return urlPattern.test(str);
  }
}
