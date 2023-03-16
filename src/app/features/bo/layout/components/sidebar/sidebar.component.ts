import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SIDEBAR_ITEMS } from '../../data/sidebar-items';
import { RouterModule } from '@angular/router';
import {SidebarModule} from 'primeng/sidebar';
import { PermitDirective } from 'src/app/core/directives/permit.directive';
import { AuthService } from 'src/app/core/services/auth.service';
import { FrontConfigurationState } from 'src/app/shared/services/front-configuration.store';
import { LangChangeComponent } from 'src/app/shared/components/lang-change/lang-change.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    SidebarModule,
    PermitDirective,
    LangChangeComponent,
    LangChangeComponent
  ],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  selectedLang: string | null = 'mk';
  sidebarItems = SIDEBAR_ITEMS;
  @Input() isMobile: boolean = false;
  @Input() hideSidebar: boolean = false;

  @Output() onHide = new EventEmitter();

  constructor(
    public frontConfigurationState: FrontConfigurationState,
    public authService: AuthService
  ) { }

  ngOnInit(): void { }

}
