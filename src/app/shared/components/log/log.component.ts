import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Log } from '../../../features/bo/pages/logs/models/log.model';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './log.component.html'
})
export class LogComponent implements OnInit {

  @Input() log: Log = {} as Log;

  constructor() { }

  ngOnInit(): void {
  }

}
