import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';
import { environment } from 'src/environments/environment';

export interface FrontConfigurationStateModel {
  configuration: Configuration;

  imageUrl: string;
  videoUrl: string;

  selectedLang: string;
}

export const initialState: FrontConfigurationStateModel = {
  configuration: {} as Configuration,

  imageUrl: `${ environment.apiUrl }/images/`,
  videoUrl: `${ environment.apiUrl }/videos/`,
  selectedLang: 'mk'
}

@Injectable({
  providedIn: 'root'
})
export class FrontConfigurationState {

  confState = new BehaviorSubject<FrontConfigurationStateModel>(initialState);
  confState$ = this.confState.asObservable();

  constructor() { }

  get state() {
    return this.confState.getValue();
  }

  setConfiguration(configuration: Configuration): void {
    this.confState.next({
      ...this.state,
      configuration
    });
  }

  setSelectedLang(lang: string): void {
    this.confState.next({
      ...this.state,
      selectedLang: lang
    });
  }

}
