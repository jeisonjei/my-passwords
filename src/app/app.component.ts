import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { AddFormComponent } from "./components/add-form/add-form.component";
import { RecordItem } from './models/interfaces';
import { ListComponent } from "./components/list/list.component";
import { RecordService } from './services/record.service';
import { FocusDirective } from './directives/focus.directive';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, HeaderComponent, AddFormComponent, ListComponent, FocusDirective]
})

export class AppComponent implements OnInit, AfterViewInit {

  constructor(
    private recordService: RecordService,
    private title: Title
  ) { }

  @ViewChild('searchElem') searchElem: ElementRef<HTMLInputElement>;
  @ViewChild('downloadButtonElem') downloadButtonElem: ElementRef<HTMLInputElement>;
  @ViewChild('uploadButtonElem') uploadButtonElem: ElementRef<HTMLInputElement>;
  @ViewChild('uploadFieldElem') uploadFieldElem: ElementRef<HTMLInputElement>;
  searchKeys: string[] = ['Escape'];
  records: RecordItem[] = [];
  found: RecordItem[] = [];
  recordServiceSubscription = this.recordService.signal$.subscribe((recs: RecordItem[]) => {
    this.records = recs;
    this.search();
  });
  searchNow: boolean = false;


  // ****************************************************************
  ngOnInit(): void {
    this.records = this.recordService.list();
    this.title.setTitle('My Passwords');
  }

  ngAfterViewInit(): void {
    document.addEventListener('keydown', this.handleSearchKeydown.bind(this));
    
    // установить высоту кнопки
    var downloadElemHeight = this.downloadButtonElem.nativeElement.offsetHeight;
    document.documentElement.style.setProperty('--download-button-height', downloadElemHeight + 'px');
    
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleSearchKeydown.bind(this));
  }

  // ***************************************************************


  handleSearchKeydown(event: KeyboardEvent) {
    if (this.searchKeys.includes(event.key)) {
      this.searchElem.nativeElement.focus();
      this.searchElem.nativeElement.value = '';
      this.search();

    }
  }


  addRecord($event: RecordItem) {
    this.records = this.recordService.addSingle($event);
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
  downloadJSON() {
    var json = JSON.stringify(this.records, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'my-passwords.json';
    a.click();
    window.URL.revokeObjectURL(url);
    
  }

  uploadFile() {
    this.uploadFieldElem.nativeElement.click();
    this.uploadFieldElem.nativeElement.onchange = () => {
      var file = this.uploadFieldElem.nativeElement.files[0];
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        var json = reader.result as string;
        var records = JSON.parse(json);
        this.recordService.addArray(records);
      }
  
    }
  }
}
