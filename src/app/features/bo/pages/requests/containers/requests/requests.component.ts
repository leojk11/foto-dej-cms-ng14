import { RevealDirective } from 'src/app/shared/directives/reveal.directive';
import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { RequestsStore } from '../../services/requests.store';
import { PopoverModule } from 'primeng/popover';
import { RequestFilters } from '../../models/requestFilters.model';

@Component({
    selector: 'app-requests',
    imports: [
        RevealDirective,
        CommonModule,
        TranslatePipe,
        TableModule,
        FormsModule,
        InputTextModule,
        PopoverModule
    ],
    providers: [
        RequestsStore
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './requests.component.html'
})
export class RequestsComponent implements OnInit {

  filters: RequestFilters = {} as RequestFilters;
  searchTerms: string[] = [];

  constructor(
    private adminLayoutService: AdminLayoutService,
    public requestsStore: RequestsStore,
    public location: Location
  ) { }

  ngOnInit() {
    this.requestsStore.getRequests();
    this.adminLayoutService.setTitle('common.requests');
  }

  getRequests(): void {
    this.requestsStore.setParams({ page: 1, take: 10 });
    this.requestsStore.getRequests(this.filters);
  }

  onLazyLoad(event: any): void {
    this.requestsStore.setParams({ page: event.first + 1, take: event.rows });
    this.requestsStore.getRequests();
  }

  filter(): void {
    this.searchTerms = [];

    if (this.filters.firstname) {
      this.searchTerms.push(this.filters.firstname);
    }

    if (this.filters.date) {
      this.searchTerms.push(this.filters.date);
    }

    if (this.filters.lastname) {
      this.searchTerms.push(this.filters.lastname);
    }

    if (this.filters.phone) {
      this.searchTerms.push(this.filters.phone);
    }

    if (this.filters.email) {
      this.searchTerms.push(this.filters.email);
    }

    this.getRequests();
  }

  clearFilter(): void {
    this.filters = {} as RequestFilters;
    this.searchTerms = [];
    this.getRequests();
  }

  clearTerm(index: number): void {
    const term = this.searchTerms.splice(index, 1)[0];

    if (term === this.filters.firstname) {
      this.filters.firstname = ''
    }

    if (term === this.filters.date) {
      this.filters.date = ''
    }

    if (term === this.filters.lastname) {
      this.filters.lastname = ''
    }

    if (term === this.filters.phone) {
      this.filters.phone = ''
    }

    if (term === this.filters.email) {
      this.filters.email = ''
    }

    this.filter();
  }
}
