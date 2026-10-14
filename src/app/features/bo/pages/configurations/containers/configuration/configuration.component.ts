import { RevealDirective } from 'src/app/shared/directives/reveal.directive';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { ConfigurationStore } from '../../services/configuration.store';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { RegularInputComponent } from '../../components/regular-input/regular-input.component';
import { RegularInputDoubleComponent } from '../../components/regular-input-double/regular-input-double.component';
import { UploadComponent } from '../../components/upload/upload.component';
import { MultiUploadComponent } from '../../components/multi-upload/multi-upload.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { VideoRegularInputComponent } from '../../components/video-regular-input/video-regular-input.component';
import { ConfirmationService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { DialogService } from 'primeng/dynamicdialog';
import { InvitationPreviewComponent } from '../../components/invitation-preview/invitation-preview.component';

@Component({
    selector: 'app-configuration',
    imports: [
        RevealDirective,
        CommonModule,
        ReactiveFormsModule,
        TranslatePipe,
        InputTextModule,
        ProgressBarModule,
        RegularInputComponent,
        RegularInputDoubleComponent,
        UploadComponent,
        MultiUploadComponent,
        YouTubePlayerModule,
        VideoRegularInputComponent,
        TabsModule
    ],
    providers: [
        ConfigurationStore,
        ConfirmationService,
        DialogService
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './configuration.component.html'
})
export class ConfigurationComponent implements OnInit {

  loaded: boolean = true;
  logoLoaded: boolean = true;
  whiteLogoLoaded: boolean = true;
  logoIconLoaded: boolean = true;

  imagesUrl: string = `${ environment.apiUrl }/images/`;
  albumImagesUrl: string = `${ environment.apiUrl }/images/album_image/`;

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
    promo_videos: new FormArray([]),
    emails_for_notifications: new FormArray([]),

    // invite part
    invite_from: [''],
    invite_subject: [''],
    invite_credentials_message: [''],
    invite_credentials_email_label: [''],
    invite_credentials_password_label: [''],
    invite_login_message: [''],
    invite_thank_you_message: ['']
  });

  constructor(
    private adminLayoutService: AdminLayoutService,
    public configurationStore: ConfigurationStore,
    private configurationService: ConfigurationService,
    private fb: FormBuilder,
    private toastService: ToastService,
    public location: Location,
    private dialog: DialogService,
    private translateService: TranslateService
  ) { }

  get promoVideos() {
    return this.form.get('promo_videos') as FormArray;
  }
  get emailsForNotifications() {
    return this.form.get('emails_for_notifications') as FormArray;
  }

  ngOnInit(): void {
    this.adminLayoutService.setTitle('common.settings');

    this.configurationStore.getConfiguration();
    this.configurationStore.state$.subscribe({
      next: state => {
        if (!!state.configuration) {
          this.form.patchValue({
            ...state.configuration
          });

          if (state.configuration.promo_videos) {
            this.promoVideos.clear();
            this.form.get('promo_videos')?.patchValue([]);
            for (const video of state.configuration.promo_videos) {
              const formControl = new FormControl(video);
              this.promoVideos.push(formControl);
            }
          }

          if (state.configuration.emails_for_notifications) {
            this.emailsForNotifications.clear();
            this.form.get('emails_for_notifications')?.patchValue([]);
            for (const email of state.configuration.emails_for_notifications) {
              const formControl = new FormControl(email);
              this.emailsForNotifications.push(formControl);
            }
          }
        }
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

  handleSubmit(): void {
    this.configurationService.updateConfiguration(this.form.value).subscribe({
      next: res => {
        this.toastService.addSuccess(res.message);
        this.configurationStore.patchConfiguration(res.configuration);
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

  cancel(): void {
    this.form.patchValue({
      ...this.configurationStore.snapshot.configuration
    });

    if (this.configurationStore.snapshot.configuration?.promo_videos) {
      this.form.get('promo_videos')?.patchValue([]);
      for (const video of this.configurationStore.snapshot.configuration.promo_videos) {
        const formControl = new FormControl(video);
        this.promoVideos.push(formControl);
      }
    }
  }

  previewInvitation(): void {
    this.dialog.open(InvitationPreviewComponent, {
      width: '50vw',
      header: this.translateService.instant('common.previewInvitation'),
      data: {
        configuration: this.configurationStore.snapshot.configuration,
        imagesUrl: this.imagesUrl
      }
    });
  }
}
