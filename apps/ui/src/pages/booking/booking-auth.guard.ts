import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CustomerCommon } from '../../services/customer-common';

export const BookingAuthGuard: CanActivateFn = (_route, state) => {
  const customerCommon = inject(CustomerCommon);
  if (customerCommon.isLoggedIn()) return true;

  return inject(Router).createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
