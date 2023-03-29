import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Configuration } from '../models/configuration.model';
import { ConfigurationService } from './configuration.service';

export interface ConfigurationState {
    configuration: Configuration | null;

    loading: boolean;
}

export const initialState: ConfigurationState = {
    configuration: null,

    loading: true
}

@Injectable()
export class ConfigurationStore extends ComponentStore<ConfigurationState> {

  constructor(
    private configurationService: ConfigurationService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService
  ) { 
    super(initialState);
  }

  get state() {
      return this.get(s => s);
  }

  getConfiguration(): void {
    this.spinner.show().then();

    this.configurationService.getConfiguration().subscribe({
      next: res => {
        console.log('configuration', res);
        
        this.patchState({
          configuration: res,
          loading: false
        });
        this.spinner.hide().then();
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    });
  }

  patchConfiguration(configuration: Configuration): void {
    const newConfiguration = {
      ...this.state.configuration,
      ...configuration,
      promo_images: JSON.parse(configuration.promo_images)
    };

    this.patchState({
      configuration: newConfiguration
    });
  }

  

}