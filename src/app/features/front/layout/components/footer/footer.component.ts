import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';
import { FrontConfigurationState } from 'src/app/shared/services/front-configuration.store';
import { TranslatePipe } from '@ngx-translate/core';
import { RevealDirective } from 'src/app/shared/directives/reveal.directive';

@Component({
    selector: 'app-footer',
    imports: [
        CommonModule,
        TranslatePipe,
        RevealDirective
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './footer.component.html'
})
export class FooterComponent {

  @Input() configuration: Configuration = {} as Configuration;

  constructor(
    public frontConfigurationState: FrontConfigurationState
  ) { }

}
