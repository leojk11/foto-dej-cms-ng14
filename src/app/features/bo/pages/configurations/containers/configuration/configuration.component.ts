import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TabsModule } from 'primeng/tabs';
import { environment } from 'src/environments/environment';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ConfigurationStore } from '../../services/configuration.store';
import { ConfigurationService } from '../../services/configuration.service';
import { Configuration } from '../../models/configuration.model';
import { RegularInputComponent } from '../../components/regular-input/regular-input.component';
import { RegularInputDoubleComponent } from '../../components/regular-input-double/regular-input-double.component';
import { UploadComponent } from '../../components/upload/upload.component';
import { MultiUploadComponent } from '../../components/multi-upload/multi-upload.component';
import { VideoRegularInputComponent } from '../../components/video-regular-input/video-regular-input.component';
import { InvitationPreviewComponent } from '../../components/invitation-preview/invitation-preview.component';

@Component({
    selector: 'app-configuration',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslatePipe,
        RegularInputComponent,
        RegularInputDoubleComponent,
        UploadComponent,
        MultiUploadComponent,
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

  imagesUrl: string = `${ environment.apiUrl }/images/`;

  // text fields and lists are saved with the form; images save themselves when picked
  form: FormGroup = this.fb.group({
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

  private formLoaded = false;

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

  ngOnInit(): void {
    this.adminLayoutService.setTitle('common.settings');

    this.configurationStore.getConfiguration();
    this.configurationStore.state$.subscribe(state => {
      // fill the form once; later store updates (image uploads) must not wipe unsaved edits
      if (state.configuration && !this.formLoaded) {
        this.formLoaded = true;
        this.resetForm(state.configuration);
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
    if (this.configurationStore.snapshot.configuration) {
      this.resetForm(this.configurationStore.snapshot.configuration);
    }
  }

  previewInvitation(): void {
    this.dialog.open(InvitationPreviewComponent, {
      dismissableMask: true,
      closable: true,
      width: '50vw',
      header: this.translateService.instant('common.previewInvitation'),
      data: {
        configuration: this.configurationStore.snapshot.configuration,
        imagesUrl: this.imagesUrl
      }
    });
  }

  private resetForm(configuration: Configuration): void {
    this.form.patchValue({ ...configuration });
    this.fillList('promo_videos', configuration.promo_videos);
    this.fillList('emails_for_notifications', configuration.emails_for_notifications);
  }

  private fillList(name: string, values: string[] | null | undefined): void {
    const list = this.form.get(name) as FormArray;
    list.clear();
    for (const value of values ?? []) {
      list.push(new FormControl(value));
    }
  }
}
