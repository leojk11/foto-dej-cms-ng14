import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontNavbarComponent } from '../components/front-navbar/front-navbar.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';
import { FrontConfigurationService } from '../../../../shared/services/front-configuration.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';
import { FrontConfigurationState } from 'src/app/shared/services/front-configuration.store';
import { ImageOverviewComponent } from 'src/app/shared/components/image-overview/image-overview.component';
import { StartLoaderComponent } from 'src/app/shared/components/start-loader/start-loader.component';

@Component({
    selector: 'app-front-layout',
    imports: [
        CommonModule,
        FrontNavbarComponent,
        RouterModule,
        FooterComponent,
        ImageOverviewComponent,
        StartLoaderComponent
    ],
    templateUrl: './front-layout.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./front-layout.component.scss']
})
export class FrontLayoutComponent implements OnInit {

  config: Configuration = {} as Configuration;

  constructor(
    private frontConfigService: FrontConfigurationService,
    public frontConfigState: FrontConfigurationState,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.frontConfigService.getConfiguration().subscribe({
      next: res => {
        this.config = res;
        this.frontConfigState.setConfiguration(res);
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

}
