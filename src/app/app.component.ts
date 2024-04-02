import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { AddFormComponent } from "./components/add-form/add-form.component";
import { RecordItem } from './models/interfaces';
import { ListComponent } from "./components/list/list.component";
import { RecordService } from './services/record.service';
import { FocusDirective } from './directives/focus.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, HeaderComponent, AddFormComponent, ListComponent, FocusDirective]
})

export class AppComponent implements OnInit, AfterViewInit {

  constructor(
    private recordService: RecordService
  ) { }
  searchKeys: string[] = ['Escape'];
  @ViewChild('searchElem') searchElem: ElementRef<HTMLInputElement>;
  records: RecordItem[] = [];
  found: RecordItem[] = [];
  recordServiceSubscription = this.recordService.signal$.subscribe((recs: RecordItem[]) => {

    this.records = recs;
    this.search();
  });
  searchNow: boolean = false;

  ngOnInit(): void {
    this.records = this.recordService.list();

  }

  handleSearchKeydown(event: KeyboardEvent) {
    if (this.searchKeys.includes(event.key)) {
      this.searchElem.nativeElement.focus();
      this.searchElem.nativeElement.value = '';
      this.search();

    }
  }
  ngAfterViewInit(): void {

    document.addEventListener('keydown', this.handleSearchKeydown.bind(this))
  }


  addRecord($event: RecordItem) {
    this.records = this.recordService.add($event);
  }
  search() {
    var nativeElement = this.searchElem.nativeElement;
    var searchValue = nativeElement.value;

    if (searchValue) {
      this.searchNow = true;
      var found = this.records.filter(rec => rec.url.toLowerCase().includes(searchValue.toLowerCase()));
      this.found = found;
    }
    else {
      this.searchNow = false;
    }
  }

}
