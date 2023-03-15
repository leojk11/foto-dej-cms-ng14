import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Log } from '../../../features/bo/pages/logs/models/log.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './log.component.html'
})
export class LogComponent implements OnInit {

  @Input() log: Log = {} as Log;

  constructor() { }

  ngOnInit(): void {
  }

}
