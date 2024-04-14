import { enableProdMode, importProvidersFrom } from '@angular/core';
import { HammerModule, bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BasicHttpInterceptor } from './app/core/interceptors/basic-http.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { ToastService } from './app/shared/services/toast.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import 'hammerjs';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(routes, { 
        onSameUrlNavigation: 'reload',
        scrollPositionRestoration: 'enabled' 
      }),
      HttpClientModule,
      BrowserAnimationsModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
      }),
      ToastrModule.forRoot(),
      ToastService,
      HammerModule
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicHttpInterceptor,
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ]
}).catch(err => console.error(err));
