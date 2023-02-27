import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { ClientsService } from '../../services/clients.service'
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../models/client.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit, OnDestroy {

  client: Client = {} as Client;
  id: string = '';
  imageUrl: string = `${ environment.apiUrl }/images/`;

  @Input() modalWidth: string = '';

  client$: Observable<Client | null> = this.clientService.getSingleClient(this.id).pipe(
    catchError(err => {
      console.log(err);
      return of(null);
    })
  );

  constructor(
    private adminLayoutService: AdminLayoutService,
    private clientService: ClientsService,
    private route: ActivatedRoute,
    public location: Location,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: params => {
        this.id = params['id'];
        this.getClient();
      }
    });
    this.adminLayoutService.setTitle('common.clients');

  }

  ngOnDestroy(): void {
    this.adminLayoutService.resetDetail();
  }

  getClient(): void {
    this.clientService.getSingleClient(this.id).subscribe({
      next: client => {
        console.log('CLIENT', client);
        
        this.client = client;
      },
      error: err => {
        console.error(err);
        
      }
    });
  }

  deleteClient(): void {
  }
}
