import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-back-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-logs.component.html',
  styleUrls: ['./back-logs.component.scss']
})
export class BackLogsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
