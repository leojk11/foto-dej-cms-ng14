import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_VERSION } from 'src/app/core/data/staticData';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  appVersion = APP_VERSION;
  @Input() showToggle: boolean = false;
  @Output() toggleSidebar = new EventEmitter();

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
   
  }

  logout(): void {
    this.authService.boLogout();
  }

}
