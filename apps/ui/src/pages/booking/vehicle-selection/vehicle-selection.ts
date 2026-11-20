import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { BookingStateService } from '../booking-state';
import {
  AvailableVehicleModel,
  BookingSearchCriteriaModel,
} from '@shared/lib/models/available-vehicle.model';
import { HttpService } from '@shared/lib/services/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrCurrencyPipe } from 'tr-currency';
import BookingSearchForm from '../components/booking-search-form/booking-search-form';

const distinct = (values: string[]) =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b, 'tr'));

@Component({
  imports: [FormsModule, BookingSearchForm, TrCurrencyPipe],
  templateUrl: './vehicle-selection.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class VehicleSelection {
  readonly #http = inject(HttpService);
  readonly #router = inject(Router);
  readonly #bookingState = inject(BookingStateService);
  #requestId = 0;

  readonly vehicles = signal<AvailableVehicleModel[]>([]);
  readonly loading = signal<boolean>(false);
  readonly criteria = this.#bookingState.searchCriteria;

  readonly selectedCategory = signal<string>('');
  readonly selectedBrand = signal<string>('');

  readonly categories = computed(() =>
    distinct(this.vehicles().map((v) => v.categoryName)),
  );
  readonly brands = computed(() =>
    distinct(this.vehicles().map((v) => v.brand)),
  );
  readonly filteredVehicles = computed(() => {
    const category = this.selectedCategory();
    const brand = this.selectedBrand();

    return this.vehicles().filter(
      (v) =>
        (!category || v.categoryName === category) &&
        (!brand || v.brand === brand),
    );
  });

  constructor() {
    effect(() => this.#load(this.criteria()));
  }

  select(vehicle: AvailableVehicleModel) {
    this.#bookingState.selectVehicle(vehicle);
    this.#router.navigateByUrl('/booking/protection-packages');
  }

  getVehiclesImage(vehicle: AvailableVehicleModel) {
    const endpoint = 'https://localhost:7216/images/';
    return endpoint + vehicle.imageUrl;
  }

  #load(criteria: BookingSearchCriteriaModel) {
    const requestId = ++this.#requestId;
    this.loading.set(true);

    this.#http.post<AvailableVehicleModel[]>(
      '/rent/booking/available-vehicles',
      criteria,
      (res) => {
        if (requestId !== this.#requestId) return;
        this.vehicles.set(res ?? []);
        this.selectedCategory.set('');
        this.selectedBrand.set('');
        this.loading.set(false);
      },
      () => {
        if (requestId === this.#requestId) this.loading.set(false);
      },
    );
  }
}
