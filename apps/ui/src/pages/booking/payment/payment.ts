import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '@shared/lib/services/http';
import { BookingStateService } from '../booking-state';
import { BookingCreateModel } from '@shared/lib/models/booking-create.model';
import BookingSummary from '../components/booking-summary/booking-summary';
import { FormsModule, NgForm } from '@angular/forms';
@Component({
  imports: [BookingSummary, FormsModule],
  templateUrl: './payment.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Payment {
  readonly #http = inject(HttpService);
  readonly #router = inject(Router);
  readonly #bookingState = inject(BookingStateService);

  readonly cardOwner = signal<string>('');
  readonly cardNumber = signal<string>('');
  readonly cardMonth = signal<string>('');
  readonly cardYear = signal<string>('');
  readonly ccv = signal<string>('');
  readonly note = signal<string>('');

  readonly submitting = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly years = Array.from({ length: 10 }, (_, i) =>
    String(new Date().getFullYear() + i),
  );

  onCardNumberInput(value: string): void {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.cardNumber.set(formatted);
  }
  onCcvInput(value: string): void {
    this.ccv.set(value.replace(/\D/g, '').slice(0, 4));
  }

  submit(form: NgForm): void {
    if (!form.valid || this.submitting()) return;

    const cleanCardNumber = this.cardNumber().replace(/\D/g, '');
    if (cleanCardNumber.length < 16){
      this.error.set(
        'Lütfen 16 haneli geçerli bir kredi kartı numarası giriniz.',
      );
      return;
    }

    if (this.#isCardExpired()){
      this.error.set('Kredi kartınızın son kullanma tarihi geçmiş.');
      return;
    }

    const criteria = this.#bookingState.searchCriteria();
    const vehicle = this.#bookingState.selectedVehicle();
    const protectionPackage = this.#bookingState.selectedProtectionPackage();

    if (!vehicle || !protectionPackage) {
      this.error.set('Araç veya güvence paketi seçimi eksik.');
      return;
    }

    const payload: BookingCreateModel = {
      pickUpLocationId: criteria.branchId,
      pickUpDate: criteria.pickUpDate,
      pickUpTime: criteria.pickUpTime,
      deliveryDate: criteria.deliveryDate,
      deliveryTime: criteria.deliveryTime,
      vehicleId: vehicle.id,
      protectionPackageId: protectionPackage.id,
      extraIds: this.#bookingState.selectedExtras().map((e) => e.id),
      note: this.note().trim() || null,
      paymentInformation: {
        cardNumber: cleanCardNumber,
        cardOwner: this.cardOwner().trim(),
        expiry: `${this.cardMonth()}/${this.cardYear().slice(-2)}`,
        ccv: this.ccv(),
      },
    };

    this.error.set(null);
    this.submitting.set(true);

    this.#http.post<string>(
      '/rent/booking',
      payload,
      (reservationNumber) => {
        this.submitting.set(false);
        this.#bookingState.completeBooking(
          reservationNumber,
          cleanCardNumber.slice(-4),
        );
        this.#router.navigateByUrl('/booking/completed-form');
      },
      () => {
        this.submitting.set(false);
        this.error.set(
          'Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.',
        );
      },
    );
  }

  #isCardExpired(): boolean {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const selectedYear = Number(this.cardYear());
    const selectedMonth = Number(this.cardMonth());

    return (
      selectedYear < currentYear ||
      (selectedYear === currentYear && selectedMonth < currentMonth)
    );
  }
}
