import { Component, Input, OnInit, OnDestroy, NgZone, ChangeDetectorRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/core/services/storage.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';
import { TooltipModule } from 'primeng/tooltip';
import { map, Observable, shareReplay } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { FrontConfigurationState } from 'src/app/shared/services/front-configuration.store';
import { LangChangeComponent } from 'src/app/shared/components/lang-change/lang-change.component';

@Component({
    selector: 'app-front-navbar',
    imports: [
        CommonModule,
        TranslatePipe,
        RouterModule,
        TooltipModule,
        MenuModule,
        LangChangeComponent
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './front-navbar.component.html'
})
export class FrontNavbarComponent implements OnInit, OnDestroy {

  @Input() gallery: boolean = false;
  // transparent over the hero photo until the page is scrolled
  @Input() overlay: boolean = false;

  @Output() goToElement = new EventEmitter();

  selectedLang: string | null = 'mk';
  config: Configuration = {} as Configuration;

  isAuthenticated: boolean = false;
  menuItems: MenuItem[] = [];

  isMobile$: Observable<boolean> = this.brakepointObserver.observe('(max-width: 887px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  scrolled: boolean = false;

  private onScroll = () => {
    const scrolled = window.scrollY > 40;

    // only re-enter angular when the state actually flips
    if (scrolled !== this.scrolled) {
      this.zone.run(() => {
        this.scrolled = scrolled;
        // the homepage hosting this navbar is OnPush
        this.cdr.markForCheck();
      });
    }
  };

  constructor(
    private storageService: StorageService,
    private translateService: TranslateService,
    private authService: AuthService,
    public frontConfigurationState: FrontConfigurationState,
    private brakepointObserver: BreakpointObserver,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedInUser();
    this.getTranslateMenuItems();

    this.scrolled = window.scrollY > 40;
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
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
        visible: !this.isAuthenticated && !this.gallery
      },
      {
        label: this.translateService.instant('common.gallery'), 
        icon: 'pi pi-th-large',
        command: () => this.goToElement.emit('slider'),
        visible: !this.isAuthenticated && !this.gallery
      },
      {
        separator: true,
        visible: this.isAuthenticated || !this.gallery
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

  // the logo is the way back home; on the homepage itself it scrolls to the top
  onLogoClick(event: Event): void {
    if (this.router.url.split(/[?#]/)[0] === '/home') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  navigate(route: string): void {
    this.router.navigate([route]).then();
  }
}
