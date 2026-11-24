import { Routes } from '@angular/router';
import { RENTAL_TERMS } from './rental-terms/rental-terms';
import { PRIVACY_POLICY } from './privacy-policy/privacy-policy';
import { TERMS_OF_USE } from './terms-of-use/terms-of-use';

const router: Routes = [
  {
    path: 'faq',
    loadComponent: () => import('./faq/faq'),
  },
  {
    path: 'rental-terms',
    loadComponent: () => import('./info-page/info-page'),
    data: { content: RENTAL_TERMS },
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./info-page/info-page'),
    data: { content: PRIVACY_POLICY },
  },
  {
    path: 'terms-of-use',
    loadComponent: () => import('./info-page/info-page'),
    data: { content: TERMS_OF_USE },
  },
];

export default router;
