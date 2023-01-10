import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SliderComponent } from '../../components/slider/slider.component';
import { FrontConfigurationService } from '../../services/front-configuration.service';
import { environment } from 'src/environments/environment';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { HomeFooterComponent } from '../../components/home-footer/home-footer.component';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    SliderComponent,
    ContactFormComponent,
    HomeFooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  videoUrl: string = `${ environment.apiUrl }/videos/`;

  configuration: Configuration = {} as Configuration;

  constructor(
    private service: FrontConfigurationService
  ) { }

  ngOnInit(): void {
    this.service.getConfiguration().subscribe({
      next: res => {
        console.log('CONFIG RES', res);
        this.configuration = res;
      }
    })
  }

}
