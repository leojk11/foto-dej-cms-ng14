import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/core/services/storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { RouterModule } from '@angular/router';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';
import { FrontConfigurationService } from '../../../../../shared/services/front-configuration.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TooltipModule } from 'primeng/tooltip';
import { map, Observable, shareReplay } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { FrontConfigurationState } from 'src/app/shared/services/front-configuration.store';

@Component({
  selector: 'app-front-navbar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    TooltipModule,
    MenuModule
  ],
  templateUrl: './front-navbar.component.html',
  styleUrls: ['./front-navbar.component.scss']
})
export class FrontNavbarComponent implements OnInit {

  selectedLang: string | null = 'mk';
  config: Configuration = {} as Configuration;
  @Input() imageUrl: string = '';
  @Output() goToElement = new EventEmitter();

  isAuthenticated: boolean = false;
  menuItems: MenuItem[] = [];

  isMobile$: Observable<boolean> = this.brakepointObserver.observe('(max-width: 887px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private storageService: StorageService,
    private translateService: TranslateService,
    private authService: AuthService,
    public frontConfigurationState: FrontConfigurationState,
    private service: FrontConfigurationService,
    private toastService: ToastService,
    private brakepointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedInUser();

    console.log('IS AUTHENTICATED', this.isAuthenticated);
    
    this.getTranslateMenuItems();
  }

  getTranslateMenuItems(): void {
    this.menuItems = [
      {
        label: this.translateService.instant('common.albums'), 
        icon: 'pi pi-images',
        routerLink: '/client/albums',
        visible: this.isAuthenticated
      },
      {
        label: this.translateService.instant('common.profile'), 
        icon: 'pi pi-user',
        routerLink: '/client/profile',
        visible: this.isAuthenticated

      },
      {
        label: this.translateService.instant('common.contact'), 
        icon: 'pi pi-comment',
        command: () => this.goToElement.emit('collaboration'),
        visible: !this.isAuthenticated
      },
      {
        label: this.translateService.instant('common.gallery'), 
        icon: 'pi pi-th-large',
        command: () => this.goToElement.emit('slider'),
        visible: !this.isAuthenticated,
      },
      {
        separator: true
      },
      {
        label: this.translateService.instant(
          this.selectedLang === 'mk' ? 'common.mk' : this.selectedLang === 'en' ? 'common.en' : 'common.mk'
        ),
        command: () => this.changeLang(),
        icon: 'pi pi-globe'
      },
      {
        label: this.translateService.instant('common.signOut'), 
        command: () => this.logout(),
        visible: this.isAuthenticated
      },
      {
        label: this.translateService.instant('common.signIn'), 
        routerLink: '/auth/client',
        visible: !this.isAuthenticated
      },
    ];
  }

  changeLang(): void {
    let lang: string = '';
    if(this.selectedLang === 'mk'){
      lang = 'en'  
    } else {
      lang = 'mk';
    }

    this.translateService.use(lang).subscribe({
      next: res => {
        this.getTranslateMenuItems();

      }
    });

    this.storageService.setItem('lang', lang);
    this.selectedLang = this.storageService.getItem('lang');
    this.frontConfigurationState.setSelectedLang(lang);
    
  }

  logout(): void {
    this.authService.userLogout();
  }

}
