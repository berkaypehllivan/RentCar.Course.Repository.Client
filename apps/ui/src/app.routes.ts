import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/layout/layout'),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home'),
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login'),
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register'),
      },
      {
        path: 'booking',
        loadChildren: () => import('./pages/booking/router'),
      },
      {
        path: 'profile',
        loadChildren: () => import('./pages/profile/router'),
      },
    ],
  },
];
