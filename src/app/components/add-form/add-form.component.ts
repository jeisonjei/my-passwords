import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild, viewChild } from '@angular/core';
import { FocusDirective } from '../../directives/focus.directive';
import { RecordItem } from '../../models/interfaces';
import { UniqueIDService } from '../../services/unique-id.service';

@Component({
  selector: 'app-add-form',
  standalone: true,
  imports: [FocusDirective],
  templateUrl: './add-form.component.html',
  styleUrl: './add-form.component.css'
})
export class AddFormComponent implements AfterViewInit, OnDestroy {
  constructor(private id: UniqueIDService) { }
  @ViewChild('form') form!: ElementRef<HTMLElement>;
  assignUsername($event: Event) {
    this.username = ($event.target as HTMLInputElement).value;
  }
  username = null;
  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEnterKeydown.bind(this));
  }
  ngAfterViewInit(): void {
    document.addEventListener('keydown', this.handleEnterKeydown.bind(this));


    var resizeObserver = new ResizeObserver(entries => {
      let formHeight = this.form.nativeElement.offsetHeight;
      document.documentElement.style.setProperty('--form-height', formHeight+'px');
    });
    resizeObserver.observe(this.form.nativeElement);
  }
  handleEnterKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (document.activeElement !== this.urlElem.nativeElement && this.urlElem.nativeElement.value === '') {
        this.urlElem.nativeElement.focus();
      }
      else {
        this.submit();
      }

    }
  }
  @ViewChild('urlElem') urlElem!: ElementRef<HTMLInputElement>;
  @Output() onSubmit: EventEmitter<RecordItem> = new EventEmitter();
  submit() {
    var record = { id: this.id.get(), url: this.url, username: this.username, password: this.password };
    this.onSubmit.emit(record);
    this.url = null;
    this.username = null;
    this.password = null;
    this.urlElem.nativeElement.focus();

  }
  assignPassword($event: Event) {
    var element = $event.target as HTMLInputElement;
    this.password = element.value;
  }
  password = null;
  assignUrl($event: Event) {
    var element = $event.target as HTMLInputElement;
    this.url = element.value;
  }
  url = null;

}
