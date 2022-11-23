import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SIDEBAR_ITEMS } from '../../data/sidebar-items';
import { StorageService } from 'src/app/core/services/storage.service';
import { RouterModule } from '@angular/router';
import {SidebarModule} from 'primeng/sidebar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    SidebarModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  selectedLang: string | null = 'mk';
  sidebarItems = SIDEBAR_ITEMS;
  @Input() isMobile: boolean = false;
  @Input() hideSidebar: boolean = false;

  @Output() onHide = new EventEmitter();

  constructor(
    private storageService: StorageService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.selectedLang = this.storageService.getItem('lang');
  }

  changeLang(lang:string): void {
    this.translateService.use(lang).subscribe({
      next: ok => {
        console.log('OK TRANSLATION', ok);
      },
      error: err => {
        console.log('ERROR TRANSLATE SERVICE USE METHOD', err);
      }
    });

    this.storageService.setItem('lang', lang);
    this.selectedLang = this.storageService.getItem('lang')
  }

  onHideSidebar(e: any): void {
    console.log('HIDE EVENT', e);
    
    // this.hideSidebar = !this.hideSidebar;
    console.log('HIDE SIDEBAR FUNC', this.hideSidebar);
    
  }
}
