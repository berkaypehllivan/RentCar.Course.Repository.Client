import { Routes } from '@angular/router';
import { bookingCriteriaGuard } from './booking-criteria';
import { selectedVehicleGuard } from './selected-vehicle.guard';
import { BookingAuthGuard } from './booking-auth.guard';
import { completedBookingGuard } from './completed-booking.guard';

const router: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout'),
    children: [
      { path: '', redirectTo: 'vehicle-selection', pathMatch: 'full' },
      {
        path: 'vehicle-selection',
        canActivate: [bookingCriteriaGuard],
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        loadComponent: () => import('./vehicle-selection/vehicle-selection'),
      },
      {
        path: 'protection-packages',
        canActivate: [selectedVehicleGuard],
        loadComponent: () =>
          import('./protection-packages/protection-packages'),
      },
      {
        path: 'pricing-extras',
        canActivate: [selectedVehicleGuard],
        loadComponent: () => import('./extras/extras'),
      },
      {
        path: 'payment',
        canActivate: [selectedVehicleGuard, BookingAuthGuard],
        loadComponent: () => import('./payment/payment'),
      },
      {
        path: 'completed-form',
        canActivate: [completedBookingGuard, BookingAuthGuard],
        loadComponent: () => import('./completed-form/completed-form'),
      },
    ],
  },
];

export default router;
