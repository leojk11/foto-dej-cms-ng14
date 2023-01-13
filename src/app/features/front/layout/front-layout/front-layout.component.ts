import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontNavbarComponent } from '../components/front-navbar/front-navbar.component';
import { RouterModule } from '@angular/router';
import { FrontFooterComponent } from '../components/front-footer/front-footer.component';
import { HomeFooterComponent } from '../../pages/home/components/home-footer/home-footer.component';

@Component({
  selector: 'app-front-layout',
  standalone: true,
  imports: [
    CommonModule,
    FrontNavbarComponent,
    RouterModule,
    HomeFooterComponent
  ],
  templateUrl: './front-layout.component.html',
  styleUrls: ['./front-layout.component.scss']
})
export class FrontLayoutComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
