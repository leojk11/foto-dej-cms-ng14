import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CountUpDirective } from 'src/app/shared/directives/count-up.directive';

@Component({
    selector: 'app-dashboard-card',
    imports: [
        CommonModule,
        RouterModule,
        CountUpDirective
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './dashboard-card.component.html'
})
export class DashboardCardComponent implements OnInit {

  @Input() data: number = 0;
  @Input() title: string = '';
  @Input() bg: string = '';
  @Input() route: string = '';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void { }

  goTo(): void {
    if (this.route && this.route !== '') {
      this.router.navigate([this.route]).then();
    }
  }
}
