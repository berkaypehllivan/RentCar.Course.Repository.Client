import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpService } from '@shared/lib/services/http';
import { TokenService } from '@shared/lib/services/token';
import { ExtraOptionModel } from '@shared/lib/models/extra.model';
import { BookingStateService } from '../booking-state';
import { TrCurrencyPipe } from 'tr-currency';
import BookingSummary from '../components/booking-summary/booking-summary';
import { CustomerCommon } from '../../../services/customer-common';

@Component({
  imports: [TrCurrencyPipe, RouterLink, BookingSummary],
  templateUrl: './extras.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Extras implements OnInit {
  readonly #http = inject(HttpService);
  readonly #router = inject(Router);
  readonly #customerCommon = inject(CustomerCommon);
  readonly #bookingState = inject(BookingStateService);

  readonly extras = signal<ExtraOptionModel[]>([]);
  readonly loading = signal<boolean>(false);

  readonly selectedExtras = this.#bookingState.selectedExtras;
  readonly isLoggedIn = this.#customerCommon.isLoggedIn;

  readonly selectedExtraIds = computed(
    () => new Set(this.selectedExtras().map((item) => item.id)),
  );

  ngOnInit(): void {
    this.#loadExtras();
  }

  isSelected(extraId: string): boolean {
    return this.selectedExtraIds().has(extraId);
  }

  toggleExtra(extra: ExtraOptionModel): void {
    this.#bookingState.toggleExtra(extra);
  }

  proceed(): void {
    if (this.isLoggedIn()) {
      this.#router.navigateByUrl('/booking/payment');
      return;
    }

    this.#router.navigate(['/login'], {
      queryParams: { returnUrl: '/booking/payment' },
    });
  }

  #loadExtras(): void {
    this.loading.set(true);

    this.#http
      .getResource<ExtraOptionModel[]>('/rent/booking/extras')
      .subscribe({
        next: (res) => {
          this.extras.set(res.data ?? []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
