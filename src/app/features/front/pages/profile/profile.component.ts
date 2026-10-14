import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'app-profile',
    imports: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
