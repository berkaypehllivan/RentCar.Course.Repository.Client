import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { HttpService } from '@shared/lib/services/http';
import { TrCurrencyPipe } from 'tr-currency';
import { BookingStateService } from '../../booking-state';
import {
  AvailableVehicleModel,
  BranchOptionModel,
} from '@shared/lib/models/available-vehicle.model';

function formatTurkishDateTime(date: string, time: string): string {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  const shortTime = time ? time.slice(0, 5) : '';
  return `${day}.${month}.${year}., ${shortTime}`;
}

@Component({
  selector: 'app-booking-summary',
  imports: [TrCurrencyPipe],
  templateUrl: './booking-summary.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BookingSummary implements OnInit {
  readonly #http = inject(HttpService);
  readonly #bookingState = inject(BookingStateService);

  readonly #branches = signal<BranchOptionModel[]>([]);

  readonly criteria = this.#bookingState.searchCriteria;
  readonly vehicle = this.#bookingState.selectedVehicle;
  readonly protectionPackage = this.#bookingState.selectedProtectionPackage;
  readonly selectedExtras = this.#bookingState.selectedExtras;

  readonly totalDay = this.#bookingState.totalDay;
  readonly vehicleTotalPrice = this.#bookingState.vehicleTotalPrice;
  readonly protectionPackageTotalPrice =
    this.#bookingState.protectionPackageTotalPrice;
  readonly extrasTotalPrice = this.#bookingState.extrasTotalPrice;
  readonly grandTotalPrice = this.#bookingState.grandTotal;

  readonly branchName = computed(() => {
    const id = this.criteria().branchId;
    return this.#branches().find((b) => b.id === id)?.name ?? '';
  });

  readonly formattedPickUp = computed(() =>
    formatTurkishDateTime(
      this.criteria().pickUpDate,
      this.criteria().pickUpTime,
    ),
  );

  readonly formattedDelivery = computed(() =>
    formatTurkishDateTime(
      this.criteria().deliveryDate,
      this.criteria().deliveryTime,
    ),
  );

  ngOnInit(): void {
    this.#http
      .getResource<BranchOptionModel[]>('/rent/booking/branches')
      .subscribe({
        next: (res) => this.#branches.set(res.data ?? []),
      });
  }

  getVehicleImage(vehicle: AvailableVehicleModel): string {
    return `https://localhost:7216/images/${vehicle.imageUrl}`;
  }
}
