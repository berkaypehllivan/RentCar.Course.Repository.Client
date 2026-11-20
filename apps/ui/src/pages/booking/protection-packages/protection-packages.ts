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
import { ProtectionPackageOptionModel } from '@shared/lib/models/protection-package.model';

@Component({
  imports: [TrCurrencyPipe],
  templateUrl: './protection-packages.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProtectionPackages implements OnInit {
  readonly #http = inject(HttpService);
  readonly #router = inject(Router);
  readonly #bookingState = inject(BookingStateService);

  readonly packages = signal<ProtectionPackageOptionModel[]>([]);
  readonly loading = signal<boolean>(false);
  readonly showUpgradeModal = signal<boolean>(false);

  readonly vehicle = this.#bookingState.selectedVehicle;
  readonly selectedPackage = this.#bookingState.selectedProtectionPackage;

  readonly allCoverages = computed(() => [
    ...new Set(this.packages().flatMap((p) => p.coverages)),
  ]);

  readonly recommendedPackage = computed(
    () => this.packages().find((p) => p.isRecommended && p.price > 0) ?? null,
  );

  readonly packageTotal = computed(
    () =>
      (this.selectedPackage()?.price ?? 0) * (this.vehicle()?.totalDay ?? 0),
  );

  ngOnInit() {
    this.loading.set(true);

    this.#http
      .getResource<
        ProtectionPackageOptionModel[]
      >('/rent/booking/protection-packages')
      .subscribe({
        next: (res) => {
          const packages = res.data ?? [];
          this.packages.set(packages);
          this.#syncSelection(packages);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  select(pkg: ProtectionPackageOptionModel) {
    this.#bookingState.selectProtectionPackage(pkg);
  }

  continue() {
    const selected = this.selectedPackage();
    const isFreeOrNone = !selected || selected.price === 0;

    if (isFreeOrNone && this.recommendedPackage()) {
      this.showUpgradeModal.set(true);
      return;
    }
    this.#goNext();
  }

  addRecommended() {
    const recommended = this.recommendedPackage();
    if (recommended) this.#bookingState.selectProtectionPackage(recommended);
    this.showUpgradeModal.set(false);
    this.#goNext();
  }

  continueWithoutUpgrade() {
    this.showUpgradeModal.set(false);
    this.#goNext();
  }
  closeModal() {
    this.showUpgradeModal.set(false);
  }

  #goNext() {
    this.#router.navigateByUrl('/booking/pricing-extras');
  }

  #syncSelection(packages: ProtectionPackageOptionModel[]) {
    const current = this.selectedPackage();
    const stillExists = current
      ? packages.find((p) => p.id === current.id)
      : undefined;

    this.#bookingState.selectProtectionPackage(
      stillExists ?? packages.find((p) => p.price === 0) ?? null,
    );
  }
}
