import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@shared/lib/interceptors/auth-interceptor';
import { httpInterceptor } from '@shared/lib/interceptors/http-interceptor';
import { errorInterceptor } from '@shared/lib/interceptors/error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(
      withInterceptors([authInterceptor, httpInterceptor, errorInterceptor]),
    ),
  ],
};
