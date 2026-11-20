import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '@shared/lib/services/http';
import { TrCurrencyPipe } from 'tr-currency';
import { BookingStateService } from '../booking-state';
import { CustomerCommon } from '../../../services/customer-common';
import { BranchOptionModel } from '@shared/lib/models/available-vehicle.model';

function formatDetailedTurkishDate(date: string, time: string): string {
  if (!date) return '';
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const weekday = new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(
    dateObj,
  );
  const formattedDay = String(day).padStart(2, '0');
  const formattedMonth = String(month).padStart(2, '0');
  const shortTime = time ? time.slice(0, 5) : '';

  return `${formattedDay}.${formattedMonth}.${year}, ${weekday} - ${shortTime}`;
}

@Component({
  imports: [TrCurrencyPipe],
  templateUrl: './completed-form.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CompletedForm implements OnInit {
  readonly #http = inject(HttpService);
  readonly #router = inject(Router);
  readonly #bookingState = inject(BookingStateService);
  readonly #common = inject(CustomerCommon);

  readonly #branches = signal<BranchOptionModel[]>([]);
  readonly booking = this.#bookingState.completedBooking;
  readonly customer = this.#common.decode;

  readonly branchName = computed(() => {
    const id = this.booking()?.searchCriteria.branchId;
    return this.#branches().find((b) => b.id === id)?.name ?? '';
  });

  readonly formattedPickUp = computed(() => {
    const criteria = this.booking()?.searchCriteria;
    return criteria
      ? formatDetailedTurkishDate(criteria.pickUpDate, criteria.pickUpTime)
      : '';
  });

  readonly formattedDelivery = computed(() => {
    const criteria = this.booking()?.searchCriteria;
    return criteria
      ? formatDetailedTurkishDate(criteria.deliveryDate, criteria.deliveryTime)
      : '';
  });

  ngOnInit(): void {
    this.#http
      .getResource<BranchOptionModel[]>('/rent/booking/branches')
      .subscribe({
        next: (res) => this.#branches.set(res.data ?? []),
      });
  }

  startNewBooking(): void {
    this.#bookingState.clearCompleted();
    this.#router.navigateByUrl('/');
  }
}
