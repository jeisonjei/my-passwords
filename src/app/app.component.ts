import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { AddFormComponent } from "./components/add-form/add-form.component";
import { RecordItem } from './models/interfaces';
import { ListComponent } from "./components/list/list.component";
import { RecordService } from './services/record.service';
import { FocusDirective } from './directives/focus.directive';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { DialogConfigService } from './services/dialog-config.service';

// --- material
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { download, upload } from './services/svgIcon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RewriteConfirmationComponent } from './dialogs/rewrite-confirmation/rewrite-confirmation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, HeaderComponent, AddFormComponent, ListComponent, FocusDirective, MatIconModule, MatDialogModule]
})

export class AppComponent implements OnInit, AfterViewInit {

  constructor(
    private recordService: RecordService,
    private title: Title,
    private matRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private dialogConfigService: DialogConfigService
  ) {
    this.matRegistry.addSvgIconLiteral('download', this.sanitizer.bypassSecurityTrustHtml(download));
    this.matRegistry.addSvgIconLiteral('upload', this.sanitizer.bypassSecurityTrustHtml(upload));

   }

  @ViewChild('searchElem') searchElem: ElementRef<HTMLInputElement>;
  @ViewChild('downloadButtonElem') downloadButtonElem: ElementRef<HTMLInputElement>;
  @ViewChild('uploadButtonElem') uploadButtonElem: ElementRef<HTMLInputElement>;
  @ViewChild('uploadFieldElem') uploadFieldElem: ElementRef<HTMLInputElement>;
  @ViewChild('rowSearch') rowSearchElem!: ElementRef<HTMLElement>;
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
    
    // передать в :root высоту строки с полем поиска
    var resizeObserver = new ResizeObserver(entries => {
      var rowSearchHeight = this.rowSearchElem.nativeElement.offsetHeight;
      document.documentElement.style.setProperty('--row-search-height', rowSearchHeight + 'px');
      
    });

    resizeObserver.observe(this.rowSearchElem.nativeElement);

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
      this.found = this.records.filter(rec => rec.url.toLowerCase().includes(searchValue.toLowerCase()));
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
      let file = this.uploadFieldElem.nativeElement.files[0];
      let reader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        
        this.dialog.open(RewriteConfirmationComponent, this.dialogConfigService.dialogConfig).afterClosed().subscribe(v => {
          if (typeof v === 'undefined') {
            return;
          }
          else if (v) {
            let json = reader.result as string;
            let records = JSON.parse(json);
            this.recordService.deleteAll();
            this.recordService.addArray(records);
            this.records = this.recordService.list();
          }
          else {
            let json = reader.result as string;
            let records = JSON.parse(json);
            this.recordService.addArray(records);
            this.records = this.recordService.list();
          }
        })
      }
  
    }
  }
}
