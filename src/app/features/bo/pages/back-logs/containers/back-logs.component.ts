import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'app-back-logs',
    imports: [],
    templateUrl: './back-logs.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./back-logs.component.scss']
})
export class BackLogsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
