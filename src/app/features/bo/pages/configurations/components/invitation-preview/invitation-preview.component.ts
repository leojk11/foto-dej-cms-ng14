import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Configuration } from '../../models/configuration.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-invitation-preview',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './invitation-preview.component.html',
  styleUrls: ['./invitation-preview.component.scss']
})
export class InvitationPreviewComponent implements OnInit {

  public configuration: Configuration = {} as Configuration;
  public imagesUrl: string = '';

  constructor(
    public authService: AuthService,
    private config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    if (this.config.data.configuration) {
      this.configuration = this.config.data.configuration;
    }
    if (this.config.data.imagesUrl) {
      this.imagesUrl = this.config.data.imagesUrl;
    }
  }

}
