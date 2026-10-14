import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Log } from '../../../features/bo/pages/logs/models/log.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-log',
    imports: [CommonModule, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './log.component.html'
})
export class LogComponent implements OnInit {

  @Input() log: Log = {} as Log;

  constructor() { }

  ngOnInit(): void {
  }

}
