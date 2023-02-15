import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/core/services/storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { RouterModule } from '@angular/router';
import { FrontConfigurationState } from '../../../pages/home/services/front-configuration.store';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';
import { FrontConfigurationService } from '../../../pages/home/services/front-configuration.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TooltipModule } from 'primeng/tooltip';
import { map, Observable, shareReplay } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

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
    this.service.getConfiguration().subscribe({
      next: res => {
        this.config = res;
        this.frontConfigurationState.setConfiguration(res);
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });

    this.isAuthenticated = this.authService.isLoggedInUser();

    this.menuItems = [
      {label: 'New', icon: 'pi pi-fw pi-plus'},
      {label: 'Open', icon: 'pi pi-fw pi-download'},
      {label: 'Undo', icon: 'pi pi-fw pi-refresh'}
  ];
  }

  changeLang(): void {
    let lang: string = '';
    if(this.selectedLang === 'mk'){
      lang = 'en'  
    } else {
      lang = 'mk';
    }

    this.translateService.use(lang).subscribe();

    this.storageService.setItem('lang', lang);
    this.selectedLang = this.storageService.getItem('lang');
    
  }

  logout(): void {
    this.authService.userLogout();
  }

}
