import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/core/services/storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-front-navbar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './front-navbar.component.html',
  styleUrls: ['./front-navbar.component.scss']
})
export class FrontNavbarComponent implements OnInit {

  selectedLang: string | null = 'mk';

  constructor(
    private storageService: StorageService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
  }

  changeLang(): void {
    let lang: string = '';
    if(this.selectedLang === 'mk'){
      lang = 'en'  
    } else {
      lang = 'mk';
    }

    this.translateService.use(lang).subscribe({
      next: ok => {
        console.log('OK TRANSLATION', ok);
      },
      error: err => {
        console.log('ERROR TRANSLATE SERVICE USE METHOD', err);
      }
    });

    this.storageService.setItem('lang', lang);
    this.selectedLang = this.storageService.getItem('lang');
    
  }

}
