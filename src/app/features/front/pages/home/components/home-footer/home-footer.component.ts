import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';
import { FrontConfigurationState } from '../../services/front-configuration.store';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-home-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.scss']
})
export class HomeFooterComponent implements OnInit {

  @Input() configuration: Configuration = {} as Configuration;
  
  isMobile$: Observable<boolean> = this.brakepointObserver.observe('(max-width: 887px)')
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    public frontConfigurationState: FrontConfigurationState,
    private brakepointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    console.log('COFIGURATIoN IN FOOTER', this.configuration);
    
  }

}
