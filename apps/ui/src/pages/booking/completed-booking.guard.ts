import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BookingStateService } from './booking-state';

export const completedBookingGuard: CanActivateFn = () => {
  const bookingState = inject(BookingStateService);
  if (bookingState.completedBooking()) return true;

  return inject(Router).createUrlTree(['/']);
};
