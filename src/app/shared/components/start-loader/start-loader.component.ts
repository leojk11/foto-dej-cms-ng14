import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'app-start-loader',
    imports: [],
    template: `
    <div class="start-loader">
      <div class="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
    
      <div class="label">
        @if (!errorOccured) {
          <h3>Application is staring...</h3>
        }
        @if (errorOccured) {
          <h3>Error has occured. Please try reloading!</h3>
        }
      </div>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./start-loader.component.scss']
})
export class StartLoaderComponent implements OnInit {

  @Input() errorOccured: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
