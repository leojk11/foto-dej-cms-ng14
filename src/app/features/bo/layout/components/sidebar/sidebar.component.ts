import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SIDEBAR_ITEMS } from '../../data/sidebar-items';
import { StorageService } from 'src/app/core/services/storage.service';
import { RouterModule } from '@angular/router';
import {SidebarModule} from 'primeng/sidebar';
import { PermitDirective } from 'src/app/core/directives/permit.directive';
import { FrontConfigurationService } from 'src/app/shared/services/front-configuration.service';
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
    private storageService: StorageService,
    private translateService: TranslateService,
    public frontConfigurationState: FrontConfigurationState,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.selectedLang = this.storageService.getItem('lang');
  }

  changeLang(lang:string): void {
    this.translateService.use(lang).subscribe({
      next: ok => {
        console.log('OK TRANSLATION', ok);
      },
      error: err => {
        console.log('ERROR TRANSLATE SERVICE USE METHOD', err);
      }
    });

    this.storageService.setItem('lang', lang);
    this.selectedLang = this.storageService.getItem('lang')
  }
}
