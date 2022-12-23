import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AdminLayoutService } from '../../services/admin-layout.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  template: `
    <div
      class="page-header"
      *ngIf="adminLayoutService.adminLayoutState$ | async as state">
      <button
        class="btn btn__icon btn__icon--dark shadow-small border-none"
        (click)="location.back()"
      >
        <span class="material-symbols-outlined">arrow_back_ios_new</span>
      </button>
      <!-- <div class="page-header__title">
        {{ state.pageTitle | translate }}
        <span *ngIf="state.detail">  &#8250;  {{ state.detail }} </span>
      </div> -->
    </div>
  `
})
export class HeaderComponent implements OnInit {

  constructor(
    public adminLayoutService: AdminLayoutService,
    public location: Location
  ) { }

  ngOnInit(): void {
  }

}
