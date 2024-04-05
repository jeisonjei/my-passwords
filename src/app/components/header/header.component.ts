import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit {
  @Output() headerHeightCalculated: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('headerElem') headerElem: ElementRef<HTMLDivElement>;
  ngAfterViewInit(): void {
    // действительная высота элемента известна только после применения шрифтов
    setTimeout(() => {
      var header = this.headerElem.nativeElement;
      var headerHeight = header.offsetHeight+'px';
      document.documentElement.style.setProperty('--header-height', headerHeight);
      
    }, 100);
  }

}
