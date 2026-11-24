import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@shared/lib/interceptors/auth-interceptor';
import { httpInterceptor } from '@shared/lib/interceptors/http-interceptor';
import { errorInterceptor } from '@shared/lib/interceptors/error-interceptor';
import { provideNgxMask } from 'ngx-mask';
import { CustomerCommon } from './services/customer-common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideNgxMask(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideAppInitializer(() => {
      const customerCommon = inject(CustomerCommon);
      const token =
        localStorage.getItem('response') ?? sessionStorage.getItem('response');

      if (token) customerCommon.decodeToken(token);
    }),
    provideHttpClient(
      withInterceptors([authInterceptor, httpInterceptor, errorInterceptor]),
    ),
  ],
};
