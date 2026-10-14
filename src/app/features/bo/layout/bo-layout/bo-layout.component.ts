import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { map, Observable, shareReplay } from 'rxjs';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { HeaderComponent } from '../components/header/header.component';
import { RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ImageOverviewComponent } from 'src/app/shared/components/image-overview/image-overview.component';
import { FrontConfigurationService } from 'src/app/shared/services/front-configuration.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Configuration } from '../../pages/configurations/models/configuration.model';
import { FrontConfigurationState } from 'src/app/shared/services/front-configuration.store';

@Component({
    selector: 'app-bo-layout',
    imports: [
    SidebarComponent,
    NavbarComponent,
    HeaderComponent,
    RouterModule,
    DrawerModule,
    ImageOverviewComponent
],
    templateUrl: './bo-layout.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./bo-layout.component.scss']
})
export class BoLayoutComponent implements OnInit {

  isMobile$: Observable<boolean> = this.brakepointObserver.observe('(max-width: 887px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  hideSidebar: boolean = false;
  isMobile: boolean = false;

  constructor(
    private brakepointObserver: BreakpointObserver,
    private frontConfigService: FrontConfigurationService,
    public frontConfigState: FrontConfigurationState,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.isMobile$.subscribe(res => this.isMobile = res);

    this.frontConfigService.getConfiguration().subscribe({
      next: res => {
        this.frontConfigState.setConfiguration(res);
      },
      error: error => {
        this.toastService.addError(error);
      }
    });
  }

  toggleSidebar(): void {
    this.hideSidebar = !this.hideSidebar;
  }

}
