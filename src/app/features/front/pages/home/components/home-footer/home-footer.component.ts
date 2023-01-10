import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';

@Component({
  selector: 'app-home-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.scss']
})
export class HomeFooterComponent implements OnInit {

  @Input() configuration: Configuration = {} as Configuration;

  constructor() { }

  ngOnInit(): void {
  }

}
