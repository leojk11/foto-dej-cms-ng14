import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-change.store';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lang-change',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SelectButtonModule,
    FormsModule
  ],
  templateUrl: './lang-change.component.html'
})
export class LangChangeComponent implements OnInit {

  languageOptions: any[] = [];

  constructor(
    private translateService: TranslateService,
    public langService: LanguageService
  ) { }

  ngOnInit(): void {
    this.getLanguageOptions()
  }

  getLanguageOptions(): void {
    this.languageOptions = [
      {
        label: this.translateService.instant('common.mk'), 
        value: 'mk'
      }, 
      {
        label: this.translateService.instant('common.en'), 
        value: 'en'
      }
    ];
  }

  changeLang(lang: any): void {
    this.langService.setLanguage(lang.value);

    console.log('LANG', lang);
    
    this.translateService.use(lang.value).subscribe({
      next: ok => {
        console.log('OK TRANSLATION', ok);
        this.getLanguageOptions();
      },
      error: err => {
        console.log('ERROR TRANSLATE SERVICE USE METHOD', err);
      }
    });
  }

}
