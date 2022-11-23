import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable, shareReplay } from 'rxjs';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { HeaderComponent } from '../components/header/header.component';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-bo-layout',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    HeaderComponent,
    RouterModule
  ],
  templateUrl: './bo-layout.component.html',
  styleUrls: ['./bo-layout.component.scss']
})
export class BoLayoutComponent implements OnInit {

  isMobile$: Observable<boolean> = this.brakepointObserver.observe('(max-width: 887px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  showSidebar: boolean = true;

  constructor(
    private brakepointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.isMobile$.subscribe(res => this.showSidebar = res)
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

}
