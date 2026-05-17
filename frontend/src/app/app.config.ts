import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { httpLoadingInterceptor } from './core/interceptors/http-loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // Learning Lab: withComponentInputBinding()
    // Route parameters such as /learning/angular/:featureId can flow directly into input() properties.
    provideRouter(routes, withComponentInputBinding()),
    // Learning Lab: HttpClient + interceptors
    // withInterceptors() registers cross-cutting HTTP behavior without changing each API service.
    provideHttpClient(withFetch(), withInterceptors([httpLoadingInterceptor])),
    MessageService,
    provideAnimations(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark'
        }
      }
    })
  ]
};
