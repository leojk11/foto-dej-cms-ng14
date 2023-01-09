import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ToastService {

  constructor(
    private messageService: MessageService,
    private translateService: TranslateService
  ) { }

  addError(message: string): void {
    this.messageService.add({ 
      severity: 'error', 
      summary: this.translateService.instant('errors.error'), 
      detail: this.translateService.instant(message)
    });
  }

  addSuccess(message: string): void {
    this.messageService.add({ 
      severity: 'success', 
      summary: this.translateService.instant('success.success'), 
      detail: this.translateService.instant(message)
    });
  }

}
