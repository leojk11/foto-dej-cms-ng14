import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientsStore } from '../../services/clients.store';
import { ClientsService } from '../../services/clients.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
    selector: 'app-new-client',
    imports: [
    TranslatePipe,
    ReactiveFormsModule,
    InputTextModule
],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './new-client.component.html'
})
export class NewClientComponent implements OnInit {

  form: FormGroup = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    phone_number: ['', Validators.required]
  });

  editMode: boolean = false;

  constructor(
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private clientsStore: ClientsStore,
    private clientsService: ClientsService,
    public dialogRef: DynamicDialogRef,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    console.log('EDIT CLIENT DATA', this.config.data);
    if (this.config.data) {
      
      this.editMode = true;

      this.form.patchValue({ ...this.config.data.client });
      this.form.removeControl('password');
    } else {
      this.editMode = false;
    }
  }

  onSubmit(): void {
    if (!this.editMode) {
      this.clientsService.addNewClient(this.form.value).subscribe({
        next: res => {
          this.clientsStore.pathExistingClients(res.client);
          this.toastService.addSuccess(res.message);

          this.dialogRef.close();
        },
        error: error => {
          this.dialogRef.close();
          this.toastService.addError(error.error.message);
        }
      });
    } else {
      this.clientsService.editClient(this.config.data.client.id, this.form.value).subscribe({
        next: res => {
          this.clientsStore.patchExistingClientSingle(this.config.data.client);
          this.toastService.addSuccess(res.message);

          this.dialogRef.close('update');
        },
        error: error => {
          this.dialogRef.close();
          this.toastService.addError(error.error.message);
        }
      });
    }
  }
}
