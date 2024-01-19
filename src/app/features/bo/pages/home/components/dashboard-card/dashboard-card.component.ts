import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
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
