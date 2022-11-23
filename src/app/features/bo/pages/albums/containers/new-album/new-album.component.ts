import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../clients/models/client.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AlbumsStore } from '../../services/albums.store';
import { AlbumsService } from '../../services/albums.service';
import { ClientsService } from '../../../clients/services/clients.service';
import { TranslateModule } from '@ngx-translate/core';
import { AssignAlbumComponent } from 'src/app/shared/components/assign-album/assign-album.component';

@Component({
  selector: 'app-new-album',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    AssignAlbumComponent
  ],
  templateUrl: './new-album.component.html',
  styleUrls: ['./new-album.component.scss']
})
export class NewAlbumComponent implements OnInit {

  addAlbumForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    date: ['', Validators.required],
    assigned_to_id: ['']
  });

  openSelectClient: boolean = false;
  selectedClient: Client = {} as Client;
  hasClient: boolean = false;

  editMode: boolean = false;

  constructor(
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private albumsStore: AlbumsStore,
    private albumsService: AlbumsService,
    private clientService: ClientsService,
    public dialogRef: DynamicDialogRef
  ) { }

  ngOnInit(): void {
    console.log('data', this.config.data);
    if (this.config.data) {
      this.editMode = true;

      if (this.config.data.assigned_to) {
        this.clientService.getSingleClient(this.config.data.assigned_to.id).subscribe({
          next: client => {
            this.selectedClient = client;
            this.hasClient = true;
          },
          error: error => {
            // this.toastService.error(error.error.message);
          }
        });
      }

      this.addAlbumForm.patchValue({
        ...this.config.data
      });
    }
  }

  handleSubmit(): void {
    if (this.selectedClient) {
      this.addAlbumForm.patchValue({
        assigned_to_id: this.selectedClient.id
      });
    }

    if (this.editMode) {
      this.albumsService.editAlbum(
        this.addAlbumForm.value,
        this.config.data.id
      ).subscribe({
        next: res => {
          this.albumsStore.patchPreviewAlbum(res.album);
          this.dialogRef.close();

          // this.toastService.success('Album has been updated');
        },
        error: error => {
          // this.toastService.error(error.error.message);
        }
      });
    } else {
      this.albumsService.addNewAlbum(this.addAlbumForm.value).subscribe({
        next: res => {
          this.albumsStore.patchExistingAlbums(res.album);
          // this.toastService.success(res.message);

          this.dialogRef.close();
        },
        error: error => {
          // this.toastService.error(error.error.message);
        }
      });
    }
  }

  patchAsignee(value: string): void {
    this.addAlbumForm.patchValue({
      assignTo: value
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
    this.patchAsignee(client.fullname);
    this.selectedClient = client;
    this.hasClient = true;
  }

  removeSelectedClient(): void {
    this.selectedClient = {} as Client;
    this.patchAsignee('');

    this.hasClient = false;
  }

}
