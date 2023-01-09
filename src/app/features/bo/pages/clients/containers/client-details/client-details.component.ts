import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { ClientsService } from '../../services/clients.service'
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit, OnDestroy {

  client: Client = {} as Client;
  id: string = '';

  constructor(
    private adminLayoutService: AdminLayoutService,
    private clientService: ClientsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: params => {
        this.id = params['id'];
        this.getClient();
      }
    });
  }

  ngOnDestroy(): void {
    this.adminLayoutService.resetDetail();
  }

  getClient(): void {
    this.clientService.getSingleClient(this.id).subscribe({
      next: client => {
        this.client = client;
        this.adminLayoutService.setTitle('common.clients', `${ client.fullname }`);
      },
      error: err => {
        console.error(err);
        
      }
    });
  }
}
