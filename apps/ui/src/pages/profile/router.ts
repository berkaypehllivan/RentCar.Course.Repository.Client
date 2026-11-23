import { Routes } from '@angular/router';
import { BookingAuthGuard } from '../booking/booking-auth.guard';

const router: Routes = [
  {
    path: '',
    canActivate: [BookingAuthGuard],
    loadComponent: () => import('./layout/layout'),
    children: [
      {
        path: 'info',
        loadComponent: () => import('./profile-info/profile-info'),
      },
      {
        path: 'rentals',
        loadComponent: () => import('./rental-history/rental-history'),
      },
      {
        path: 'rentals/:id',
        loadComponent: () => import('./rental-detail/rental-detail'),
      },
      {
        path: 'change-password',
        loadComponent: () => import('./change-password/change-password'),
      },
    ],
  },
];

export default router;
