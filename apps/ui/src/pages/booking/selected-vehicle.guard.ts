import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BookingStateService } from './booking-state';
import { criteriaToQueryParams } from './booking-criteria';

export const selectedVehicleGuard: CanActivateFn = () => {
  const bookingState = inject(BookingStateService);
  const router = inject(Router);

  if (bookingState.selectedVehicle()) return true;

  const criteria = bookingState.searchCriteria();
  if (!criteria.branchId) return router.createUrlTree(['/']);

  return router.createUrlTree(['/booking/vehicle-selection'], {
    queryParams: criteriaToQueryParams(criteria),
  });
};
