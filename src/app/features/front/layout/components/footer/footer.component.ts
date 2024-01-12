import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, Observable, shareReplay } from 'rxjs';
import { FrontConfigurationState } from 'src/app/shared/services/front-configuration.store';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule
  ],
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  @Input() configuration: Configuration = {} as Configuration;
  
  isMobile$: Observable<boolean> = this.brakepointObserver.observe('(max-width: 887px)')
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private brakepointObserver: BreakpointObserver,
    public frontConfigurationState: FrontConfigurationState
  ) { }

  ngOnInit(): void {
    
  }

}
