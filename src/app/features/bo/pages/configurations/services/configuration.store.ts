import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
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
    ) { 
        super(initialState);
    }

    get state() {
        return this.get(s => s);
    }

    getConfiguration(): void {
        this.configurationService.getConfiguration().subscribe({
            next: res => {
                this.patchState({
                    configuration: res,

                    loading: false
                });
            },
            error: error => {
                // this.toast.error(error.error.message);
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
