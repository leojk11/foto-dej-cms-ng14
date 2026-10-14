import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'app-spinner',
    imports: [],
    templateUrl: './spinner.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
