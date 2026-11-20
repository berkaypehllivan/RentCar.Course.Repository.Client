import { inject } from '@angular/core';
import { CanActivateFn, ParamMap, Params, Router } from '@angular/router';
import { BookingSearchCriteriaModel } from '@shared/lib/models/available-vehicle.model';
import { BookingStateService } from './booking-state';

const DATE_TIME_RE = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/;

export function todayAsDateInput(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function isPickUpInPast(criteria: BookingSearchCriteriaModel): boolean {
  return criteria.pickUpDate < todayAsDateInput();
}

export function criteriaToQueryParams(
  criteria: BookingSearchCriteriaModel,
): Params {
  return {
    branch: criteria.branchId,
    from: `${criteria.pickUpDate}T${criteria.pickUpTime.slice(0, 5)}`,
    to: `${criteria.deliveryDate}T${criteria.deliveryTime.slice(0, 5)}`,
  };
}

export function isValidPeriod(criteria: BookingSearchCriteriaModel): boolean {
  const start = new Date(`${criteria.pickUpDate}T${criteria.pickUpTime}`);
  const end = new Date(`${criteria.deliveryDate}T${criteria.deliveryTime}`);
  return !isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start;
}

export function criteriaFromQueryParams(
  params: ParamMap,
): BookingSearchCriteriaModel | null {
  const branchId = params.get('branch');
  const from = DATE_TIME_RE.exec(params.get('from') ?? '');
  const to = DATE_TIME_RE.exec(params.get('to') ?? '');
  if (!branchId || !from || !to) return null;

  const criteria: BookingSearchCriteriaModel = {
    branchId,
    pickUpDate: from[1],
    pickUpTime: `${from[2]}:00`,
    deliveryDate: to[1],
    deliveryTime: `${to[2]}:00`,
  };

  return isValidPeriod(criteria) && !isPickUpInPast(criteria) ? criteria : null;
}

export const bookingCriteriaGuard: CanActivateFn = (route) => {
  const criteria = criteriaFromQueryParams(route.queryParamMap);
  if (!criteria) return inject(Router).createUrlTree(['/']);

  inject(BookingStateService).setSearchCriteria(criteria);
  return true;
};
