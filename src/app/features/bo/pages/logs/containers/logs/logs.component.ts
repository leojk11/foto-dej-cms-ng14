import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LogStore } from '../../services/log.store';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { LogComponent } from 'src/app/shared/components/log/log.component';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    TranslateModule,
    LogComponent
  ],
  providers: [ LogStore ],
  templateUrl: './logs.component.html'
})
export class LogsComponent implements OnInit {

  constructor(
    public logStore: LogStore,
    public location: Location,
    private adminLayoutService: AdminLayoutService
  ) { }

  ngOnInit(): void {
    this.adminLayoutService.setTitle('common.logs')
    this.logStore.getAllLogs();
  }

}
