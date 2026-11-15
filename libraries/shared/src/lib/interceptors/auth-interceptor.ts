import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
  const clone = req.clone({
    headers: new HttpHeaders({
      Authorization: token ? 'Bearer ' + token : '',
    }),
  });

  return next(clone);
};
