import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AdminLayoutService } from '../../services/admin-layout.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-header',
    imports: [
        CommonModule,
        TranslatePipe
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
    @if (adminLayoutService.adminLayoutState$ | async; as state) {
      <div
        class="page-header"
        >
        <button
          class="btn btn__icon btn__icon--dark shadow-small border-none"
          (click)="location.back()"
          >
          <i class="pi pi-arrow-left"></i>
        </button>
        <!-- <div class="page-header__title">
        {{ state.pageTitle | translate }}
        <span *ngIf="state.detail">  &#8250;  {{ state.detail }} </span>
      </div> -->
    </div>
    }
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
