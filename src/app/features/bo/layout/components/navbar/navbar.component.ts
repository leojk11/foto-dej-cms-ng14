import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { APP_VERSION } from 'src/app/core/data/staticData';
import { AuthService } from 'src/app/core/services/auth.service';
import { AdminLayoutService } from '../../services/admin-layout.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  appVersion = APP_VERSION;
  @Input() showToggle: boolean = false;
  @Output() toggleSidebar = new EventEmitter();

  constructor(
    public authService: AuthService,
    public adminLayoutService: AdminLayoutService,
    public location: Location
  ) { }

  ngOnInit(): void {

    console.log('USER', this.authService.user);
    
   
  }

  logout(): void {
    this.authService.boLogout();
  }

}
