import { computed, effect, Injectable, signal } from '@angular/core';
import {
  AvailableVehicleModel,
  BookingSearchCriteriaModel,
  initialBookingSearchCriteria,
} from '@shared/lib/models/available-vehicle.model';

import { ProtectionPackageOptionModel } from '@shared/lib/models/protection-package.model';
import { ExtraOptionModel } from '@shared/lib/models/extra.model';

const STORAGE_KEY = 'booking-state';
const COMPLETED_STORAGE_KEY = 'booking-completed';

export interface CompletedBookingModel {
  reservationNumber: string;
  searchCriteria: BookingSearchCriteriaModel;
  vehicle: AvailableVehicleModel;
  protectionPackage: ProtectionPackageOptionModel | null;
  extras: ExtraOptionModel[];
  cardLastFour: string;
  totalDay: number;
  vehicleTotalPrice: number;
  protectionPackageTotalPrice: number;
  extrasTotalPrice: number;
  grandTotalPrice: number;
}

@Injectable({ providedIn: 'root' })
export class BookingStateService {
  readonly searchCriteria = signal<BookingSearchCriteriaModel>({
    ...initialBookingSearchCriteria,
  });
  readonly selectedVehicle = signal<AvailableVehicleModel | null>(null);
  readonly selectedProtectionPackage =
    signal<ProtectionPackageOptionModel | null>(null);

  readonly selectedExtras = signal<ExtraOptionModel[]>([]);
  readonly completedReservationNumber = signal<string | null>(null);
  readonly completedBooking = signal<CompletedBookingModel | null>(null);

  readonly totalDay = computed(() => this.selectedVehicle()?.totalDay ?? 1);

  readonly vehicleTotalPrice = computed(
    () => this.selectedVehicle()?.totalPrice ?? 0,
  );
  readonly protectionPackageTotalPrice = computed(() => {
    const pkg = this.selectedProtectionPackage();
    return pkg ? pkg.price * this.totalDay() : 0;
  });

  readonly extrasTotalPrice = computed(() =>
    this.selectedExtras().reduce((sum, item) => sum + item.price, 0),
  );

  readonly grandTotal = computed(
    () =>
      this.vehicleTotalPrice() +
      this.protectionPackageTotalPrice() +
      this.extrasTotalPrice(),
  );

  constructor() {
    this.#restore();
    effect(() =>
      this.#persist({
        searchCriteria: this.searchCriteria(),
        selectedVehicle: this.selectedVehicle(),
        selectedProtectionPackage: this.selectedProtectionPackage(),
        selectedExtras: this.selectedExtras(),
      }),
    );
  }

  private isSameCriteria = (
    a: BookingSearchCriteriaModel,
    b: BookingSearchCriteriaModel,
  ) =>
    a.branchId === b.branchId &&
    a.pickUpDate === b.pickUpDate &&
    a.pickUpTime === b.pickUpTime &&
    a.deliveryDate === b.deliveryDate &&
    a.deliveryTime === b.deliveryTime;

  setSearchCriteria(criteria: BookingSearchCriteriaModel): void {
    if (!this.isSameCriteria(this.searchCriteria(), criteria)) {
      this.selectedVehicle.set(null);
      this.selectedProtectionPackage.set(null);
      this.selectedExtras.set([]);
    }
    this.searchCriteria.set(criteria);
  }

  selectVehicle(vehicle: AvailableVehicleModel): void {
    this.selectedVehicle.set(vehicle);
  }

  selectProtectionPackage(pkg: ProtectionPackageOptionModel | null): void {
    this.selectedProtectionPackage.set(pkg);
  }

  toggleExtra(extra: ExtraOptionModel): void {
    this.selectedExtras.update((current) => {
      const exists = current.some((item) => item.id === extra.id);
      return exists
        ? current.filter((item) => item.id !== extra.id)
        : [...current, extra];
    });
  }

  completeBooking(reservationNumber: string, cardLastFour: string): void {
    const vehicle = this.selectedVehicle();
    if (!vehicle) return;

    const snapshot: CompletedBookingModel = {
      reservationNumber,
      searchCriteria: { ...this.searchCriteria() },
      vehicle,
      protectionPackage: this.selectedProtectionPackage(),
      extras: [...this.selectedExtras()],
      cardLastFour,
      totalDay: this.totalDay(),
      vehicleTotalPrice: this.vehicleTotalPrice(),
      protectionPackageTotalPrice: this.protectionPackageTotalPrice(),
      extrasTotalPrice: this.extrasTotalPrice(),
      grandTotalPrice: this.grandTotal(),
    };

    this.completedBooking.set(snapshot);
    try {
      sessionStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(snapshot));
    } catch {}

    this.reset();
  }

  reset(): void {
    this.searchCriteria.set({ ...initialBookingSearchCriteria });
    this.selectedVehicle.set(null);
    this.selectedProtectionPackage.set(null);
    this.selectedExtras.set([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  clearCompleted(): void {
    this.completedBooking.set(null);
    try {
      sessionStorage.removeItem(COMPLETED_STORAGE_KEY);
    } catch {}
  }

  #restore(): void {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.searchCriteria) this.searchCriteria.set(saved.searchCriteria);
        if (saved.selectedVehicle)
          this.selectedVehicle.set(saved.selectedVehicle);
        if (saved.selectedProtectionPackage)
          this.selectedProtectionPackage.set(saved.selectedProtectionPackage);
        if (Array.isArray(saved.selectedExtras))
          this.selectedExtras.set(saved.selectedExtras);
      }

      const completedRaw = sessionStorage.getItem(COMPLETED_STORAGE_KEY);
      if (completedRaw) {
        this.completedBooking.set(JSON.parse(completedRaw));
      }
    } catch {}
  }

  #persist(state: unknown): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }
}
