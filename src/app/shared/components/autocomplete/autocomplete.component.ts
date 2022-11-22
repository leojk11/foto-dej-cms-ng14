import { CommonModule } from '@angular/common';
import { CdkVirtualScrollViewport, ScrollDispatcher, ScrollingModule } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { filter, Subject, takeUntil, throttleTime } from 'rxjs';
import { fadeIn } from '../../animations/fadeInOut';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ScrollingModule,
    FormsModule
  ],
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  animations: [ fadeIn ]
})
export class AutocompleteComponent implements OnInit {

  inputValue = '';
  selectedValue: any = null;

  showDropdown = false;

  @Input() disabled: boolean = false;
  @Input() options: any = [];
  @Input() toggleOnFocus: boolean = false;
  @Input() placeholder: string = 'Search...';
  @Input() preSelectedValue: any = null;

  @Output() value = new EventEmitter<any>();
  @Output() selected = new EventEmitter<any>();
  @Output() onScroll = new EventEmitter<any>();

  @ViewChild(CdkVirtualScrollViewport) virtualScroll!: CdkVirtualScrollViewport;
  destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private scrollDispatcher: ScrollDispatcher
  ) { }

  ngOnInit(): void {

    if(this.preSelectedValue) {
      this.inputValue = this.preSelectedValue.description;
      this.selectedValue = this.preSelectedValue;
    } else {
      this.inputValue = '';
      this.selectedValue = null;
    }

    this.scrollDispatcher
      .scrolled()
      .pipe(
        takeUntil(this.destroy$),
        filter(_ => this.virtualScroll.measureScrollOffset('bottom') < 50),
        throttleTime(500),
      ).subscribe(_ => {
        // this.onInputChange();
        this.onScroll.emit(_);
      });
  }

  ngOnChanges(): void {
    // console.log('CHANGE');
    // if(this.preSelectedValue) {
    //   this.inputValue = this.preSelectedValue.description;
    //   this.selectedValue = this.preSelectedValue;
    // } else {
    //   this.inputValue = '';
    //   this.selectedValue = null;
    // }
  }

  toggleDropdown(): void {
    if(!this.disabled) {
      this.showDropdown = !this.showDropdown;
    }
  }

  onInputChange(): void {
    this.value.emit(this.inputValue);
  }

  onInputFocus(): void {
    if(!this.disabled) {
      if(this.toggleOnFocus) {
        this.showDropdown = true;
      }
    }
  }

  onValueSelect(event: any): void {
    console.log('EVENT ON SELECT', event);
    if(event) {
      this.selectedValue = event;

      // change input value with event description
      this.inputValue = event.description;

      this.selected.emit(this.selectedValue);

      this.showDropdown = false;
    }
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  cleanValues(): void {
    this.inputValue = '';
    this.selectedValue = null;

    this.onInputChange()
  }

}
