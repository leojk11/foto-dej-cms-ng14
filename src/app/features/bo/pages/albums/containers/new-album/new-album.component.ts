import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../clients/models/client.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AlbumsStore } from '../../services/albums.store';
import { AlbumsService } from '../../services/albums.service';
import { ClientsService } from '../../../clients/services/clients.service';
import { TranslateModule } from '@ngx-translate/core';
import { AssignAlbumComponent } from 'src/app/shared/components/assign-album/assign-album.component';
import { InputTextModule } from 'primeng/inputtext';
import { ToastService } from 'src/app/shared/services/toast.service';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { BasicParams } from 'src/app/shared/models/basicParams.model';

@Component({
  selector: 'app-new-album',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    AssignAlbumComponent,
    InputTextModule,
    AutoCompleteModule
  ],
  providers: [
    DialogService,
    AlbumsStore
  ],
  templateUrl: './new-album.component.html'
})
export class NewAlbumComponent implements OnInit {

  addAlbumForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    date: ['', Validators.required],
    assigned_to_id: [''],
    assignTo: ['']
  });

  openSelectClient: boolean = false;
  selectedClient: Client = {} as Client;
  hasClient: boolean = false;
  clients: any[] = [];
  editMode: boolean = false;

  constructor(
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private albumsStore: AlbumsStore,
    private albumsService: AlbumsService,
    private clientService: ClientsService,
    public dialogRef: DynamicDialogRef,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.getClients();

    if (this.config.data) {
      console.log('data', this.config.data);
      this.editMode = true;

      if (this.config.data.assigned_to_id) {
        this.clientService.getSingleClient(this.config.data.assigned_to_id).subscribe({
          next: client => {
            this.selectedClient = client;
            this.hasClient = true;
            this.onClientSelected(client);
          },
          error: error => {
            this.toastService.addError(error.error.message);
          }
        });
      }

      this.addAlbumForm.patchValue({
        ...this.config.data
      });
    }

    if(this.config.data.client) {
      this.onClientSelected(this.config.data.client);
      this.addAlbumForm.patchValue({
        assignTo: this.config.data.client
      })
    }

  }

  getClients(query?: string): void {
    let params: BasicParams = {
      page: 1, 
      take: 10
    }

    if(query) {
      params = {
        ...params,
        name: query
      }
    }

    this.clientService.getAllCLients(params).subscribe({
      next: res => {
        this.clients = res.list;
        console.log('Clients', this.clients);
      }
    });
  }

  search(event: any) {
    console.log('AUTOCOMPLETE EVENT', event);
    const params = {
      page: 1, 
      take: 10,
      name: event.query
    }
    
    this.getClients(event.query)
  }

  handleSubmit(): void {
    if (this.selectedClient) {
      this.addAlbumForm.patchValue({
        assigned_to_id: this.selectedClient.id
      });

      this.addAlbumForm.removeControl('assignTo');
    }


    if (this.editMode) {
      this.albumsService.editAlbum(
        this.addAlbumForm.value,
        this.config.data.id
      ).subscribe({
        next: res => {
          this.albumsStore.patchPreviewAlbum(res.album);
          this.dialogRef.close();

          this.toastService.addSuccess(res.message);
        },
        error: error => {
          this.toastService.addError(error.error.message);
        }
      });
    } else {
      this.albumsService.addNewAlbum(this.addAlbumForm.value).subscribe({
        next: res => {
          this.albumsStore.patchExistingAlbums(res.album);
          this.toastService.addSuccess(res.message);

          this.dialogRef.close('new');
        },
        error: error => {
          this.toastService.addError(error.error.message);
        }
      });
    }
  }

  patchAsignee(client: Client): void {
    this.addAlbumForm.patchValue({
      ...this.addAlbumForm.value,
      assignTo: client,
      assigned_to_id: client.id
    });
  }

  onSelectClient(): void {
    this.openSelectClient = true;
  }

  onCloseModal(): void {
    this.openSelectClient = false;
  }

  onClientSelected(client: Client): void {
    this.openSelectClient = false;
    this.patchAsignee(client);
    this.selectedClient = client;
    this.hasClient = true;
    console.log('FORM VALUE', this.addAlbumForm.value);
    
  }
}
