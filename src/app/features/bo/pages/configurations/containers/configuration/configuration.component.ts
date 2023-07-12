import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { ConfigurationStore } from '../../services/configuration.store';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { RegularInputComponent } from '../../components/regular-input/regular-input.component';
import { RegularInputDoubleComponent } from '../../components/regular-input-double/regular-input-double.component';
import { UploadComponent } from '../../components/upload/upload.component';
import { MultiUploadComponent } from '../../components/multi-upload/multi-upload.component';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { VideoRegularInputComponent } from '../../components/video-regular-input/video-regular-input.component';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule,
    ProgressBarModule,
    RegularInputComponent,
    RegularInputDoubleComponent,
    UploadComponent,
    MultiUploadComponent,
    NgxYoutubePlayerModule,
    VideoRegularInputComponent
  ],
  providers: [
    ConfigurationStore
  ],
  templateUrl: './configuration.component.html'
})
export class ConfigurationComponent implements OnInit {

  loaded: boolean = true;
  logoLoaded: boolean = true;
  whiteLogoLoaded: boolean = true;
  logoIconLoaded: boolean = true;

  imagesUrl: string = `${ environment.apiUrl }/images/`;

  form: FormGroup = this.fb.group({
    logo: [''],
    main_title: [''],
    main_title_tr: [''],
    second_title: [''],
    second_title_tr: [''],
    phone_number: [''],
    email: [''],
    address: [''],
    facebook_link: [''],
    insta_link: [''],
    promo_video: ['']
  });

  constructor(
    private adminLayoutService: AdminLayoutService,
    public configurationStore: ConfigurationStore,
    private configurationService: ConfigurationService,
    private fb: FormBuilder,
    private toastService: ToastService,
    public location: Location
  ) { }

  ngOnInit(): void {
    this.adminLayoutService.setTitle('common.settings');

    this.configurationStore.getConfiguration();
    this.configurationStore.state$.subscribe({
      next: state => {
        if (!!state.configuration) {
          this.form.patchValue({
            ...state.configuration
          });
        }
      }
    });
  }

  handleSubmit(): void {
    this.configurationService.updateConfiguration(this.form.value).subscribe({
      next: res => {
        this.toastService.addSuccess(res.message);
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

  cancel(): void {
    this.form.patchValue({
      ...this.configurationStore.state.configuration
    });
  }
}
