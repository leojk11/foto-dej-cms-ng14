import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable,  } from 'rxjs';
import { StorageService } from 'src/app/core/services/storage.service';

export interface Language {
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  langState$$ = new BehaviorSubject<Language>({language: 'mk'});
  langState$ = this.langState$$.asObservable();

  constructor(
    private storageService: StorageService
  ) {}

  get state(): Language {
    return this.langState$$.getValue();
  }

  setLanguage(lang: string): void {
    this.storageService.setItem('lang', lang);
    this.langState$$.next({language: lang});
  }
}