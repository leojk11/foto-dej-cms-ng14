import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
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
        private toastService: ToastService
    ) { 
        super(initialState);
    }

    get state() {
        return this.get(s => s);
    }

    getConfiguration(): void {
        this.configurationService.getConfiguration().subscribe({
            next: res => {
                console.log('configuration', res);
                
                this.patchState({
                    configuration: res,

                    loading: false
                });
            },
            error: error => {
                this.toastService.addError(error.error.message);
            }
        });
    }

    updateConfiguration(configuration: Configuration): void {
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
