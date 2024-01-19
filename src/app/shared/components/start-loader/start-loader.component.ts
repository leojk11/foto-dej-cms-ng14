import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-start-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="start-loader">
      <div class="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div class="label">
        <h3 *ngIf="!errorOccured">Application is staring...</h3>
        <h3 *ngIf="errorOccured">Error has occured. Please try reloading!</h3>
      </div>
    </div>
  `,
  styleUrls: ['./start-loader.component.scss']
})
export class StartLoaderComponent implements OnInit {

  @Input() errorOccured: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
