import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerRentalDetailModel } from '@shared/lib/models/customer.rental.model';
import { HttpService } from '@shared/lib/services/http';
import { FlexiToastService } from 'flexi-toast';
import { TrCurrencyPipe } from 'tr-currency';
import { RENTAL_STATUS } from '../rental-history/rental-history';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
  imports: [DatePipe, TrCurrencyPipe, RouterLink, NgxMaskPipe],
  templateUrl: './rental-detail.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RentalDetail implements OnInit {
  readonly #http = inject(HttpService);
  readonly #toast = inject(FlexiToastService);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #destroyRef = inject(DestroyRef);

  readonly loading = signal<boolean>(false);
  readonly cancelling = signal<boolean>(false);
  readonly confirmCancel = signal<boolean>(false);
  readonly detail = signal<CustomerRentalDetailModel | null>(null);

  readonly canCancel = computed(
    () => this.detail()?.status === RENTAL_STATUS.PENDING,
  );

  readonly totalHours = computed(() => (this.detail()?.totalDay ?? 0) * 24);

  readonly statusInfo = computed(() => {
    const status = this.detail()?.status;
    switch (status) {
      case RENTAL_STATUS.DELIVERED:
        return {
          bannerClass: 'active',
          badgeClass: 'bg-success',
          icon: 'bi-car-front-fill',
          title: 'Araç Teslim Edildi (Aktif Kiralama)',
          description:
            'Aracınız şu anda kullanımınızda. İyi yolculuklar dileriz.',
        };
      case RENTAL_STATUS.PENDING:
        return {
          bannerClass: 'active',
          badgeClass: 'bg-warning text-dark',
          icon: 'bi-hourglass-split',
          title: 'Rezervasyon Onay Bekliyor',
          description:
            'Rezervasyonunuz oluşturuldu, teslim alma tarihinde şubemizden aracınızı teslim alabilirsiniz.',
        };
      case RENTAL_STATUS.COMPLETED:
        return {
          bannerClass: 'completed',
          badgeClass: 'bg-secondary',
          icon: 'bi-check-circle-fill',
          title: 'Kiralama Tamamlandı',
          description: 'Bu kiralama işlemi başarıyla tamamlanmıştır.',
        };
      case RENTAL_STATUS.CANCELED:
        return {
          bannerClass: 'cancelled',
          badgeClass: 'bg-danger',
          icon: 'bi-x-circle-fill',
          title: 'Rezervasyon İptal Edildi',
          description: 'Bu rezervasyon iptal edilmiştir.',
        };
      default:
        return {
          bannerClass: 'active',
          badgeClass: 'bg-primary',
          icon: 'bi-info-circle-fill',
          title: status ?? '',
          description: '',
        };
    }
  });

  ngOnInit(): void {
    this.#route.paramMap
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((params) => {
        const id = params.get('id');
        if (!id) {
          this.#router.navigateByUrl('/profile/rentals');
          return;
        }
        this.#loadDetail(id);
      });
  }

  getVehicleImage(imageUrl: string): string {
    return `https://localhost:7216/images/${imageUrl}`;
  }

  cancelReservation() {
    const current = this.detail();
    if (!current || !this.canCancel() || this.cancelling()) return;

    this.cancelling.set(true);
    this.#http.put<string>(
      `/rent/customer-portal/rentals/${current.id}/cancel`,
      {},
      (message) => {
        this.cancelling.set(false);
        this.confirmCancel.set(false);
        this.detail.set({ ...current, status: RENTAL_STATUS.CANCELED });
        this.#toast.showToast('Başarılı', message);
      },
      () => {
        this.cancelling.set(false);
        this.#toast.showToast(
          'Hata',
          'Rezervasyon İptal Edilirken Bir Hata Oluştu.',
          'error',
        );
      },
    );
  }

  #loadDetail(id: string) {
    this.loading.set(true);
    this.confirmCancel.set(false);
    this.#http
      .getResource<CustomerRentalDetailModel>(
        `/rent/customer-portal/rentals/${id}`,
      )
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.detail.set(res.data);
          } else {
            this.#toast.showToast(
              'Hata',
              'Rezervasyon detayı bulunamadı.',
              'error',
            );
            this.#router.navigateByUrl('/profile/rentals');
          }
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.#toast.showToast('Hata', 'Rezervasyon detalı yüklenemedi.');
          this.#router.navigateByUrl('/profile/rentals');
        },
      });
  }
}
