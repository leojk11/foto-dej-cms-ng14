import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';
import { FrontConfigurationState } from '../../services/front-configuration.store';

@Component({
  selector: 'app-home-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.scss']
})
export class HomeFooterComponent implements OnInit {

  @Input() configuration: Configuration = {} as Configuration;

  constructor(
    public frontConfigurationState: FrontConfigurationState
  ) { }

  ngOnInit(): void {
    console.log('COFIGURATIoN IN FOOTER', this.configuration);
    
  }

}
