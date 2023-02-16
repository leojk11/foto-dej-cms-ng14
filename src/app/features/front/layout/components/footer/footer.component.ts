import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
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
    private brakepointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    
  }

}
