import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpService } from '@shared/lib/services/http';
import { TrCurrencyPipe } from 'tr-currency';
import {
  CustomerRentalHistoryResponseModel,
  CustomerRentalItemModel,
  CustomerRentalStatsModel,
} from '@shared/lib/models/customer.rental.model';

export type DateRangeFilter =
  | 'all'
  | '30days'
  | '3months'
  | '6months'
  | '1year';

export type StatusFilter = 'all' | 'active' | 'completed' | 'cancelled';

export const RENTAL_STATUS = {
  PENDING: 'Bekliyor',
  DELIVERED: 'Teslim Edildi',
  COMPLETED: 'Tamamlandı',
  CANCELED: 'İptal Edildi',
} as const;

const PAGE_SIZE = 5;

@Component({
  imports: [FormsModule, RouterLink, DatePipe, TrCurrencyPipe],
  templateUrl: './rental-history.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RentalHistory implements OnInit {
  readonly #http = inject(HttpService);

  readonly loading = signal<boolean>(false);
  readonly rentals = signal<CustomerRentalItemModel[]>([]);
  readonly stats = signal<CustomerRentalStatsModel>({
    totalRentals: 0,
    activeRentals: 0,
    totalDays: 0,
    totalSpent: 0,
  });

  readonly dateFilter = signal<DateRangeFilter>('all');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly searchQuery = signal<string>('');
  readonly currentPage = signal<number>(1);

  readonly filteredRentals = computed(() => {
    const items = this.rentals();
    const dateRange = this.dateFilter();
    const status = this.statusFilter();
    const query = this.searchQuery().trim().toLowerCase();

    const cutoffDate = this.#getCutoffDate(dateRange);

    return items.filter((item) => {
      if (cutoffDate && new Date(item.createdAt) < cutoffDate) return false;
      if (status !== 'all' && this.#normalizeStatus(item.status) !== status)
        return false;

      if (query) {
        const haystack =
          `${item.vehicleBrand} ${item.vehicleModel} ${item.reservationNumber} ${item.pickUpLocationName}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredRentals().length / PAGE_SIZE)),
  );

  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1),
  );

  readonly paginatedRentals = computed(() => {
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * PAGE_SIZE;
    return this.filteredRentals().slice(start, start + PAGE_SIZE);
  });

  readonly rangeInfo = computed(() => {
    const total = this.filteredRentals().length;
    if (total === 0) return { start: 0, end: 0, total: 0 };
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, total);
    return { start, end, total };
  });

  ngOnInit(): void {
    this.#loadRentals();
  }

  onFilterChange() {
    this.currentPage.set(1);
  }

  resetFilters() {
    this.dateFilter.set('all');
    this.statusFilter.set('all');
    this.searchQuery.set('');
    this.currentPage.set(1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  getVehicleImage(imageUrl: string) {
    return `https://localhost:7216/images/${imageUrl}`;
  }

  isActiveRental(status: string) {
    return this.#normalizeStatus(status) === 'active';
  }

  isCancelledRental(status: string) {
    return this.#normalizeStatus(status) === 'cancelled';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case RENTAL_STATUS.DELIVERED:
        return 'bg-success';
      case RENTAL_STATUS.PENDING:
        return 'bg-warning text-dark';
      case RENTAL_STATUS.COMPLETED:
        return 'bg-secondary';
      case RENTAL_STATUS.CANCELED:
        return 'bg-danger';
      default:
        return 'bg-primary';
    }
  }

  getStatusLabel(status: string): string {
    return status;
  }

  #normalizeStatus(status: string): Exclude<StatusFilter, 'all'> {
    if (status === RENTAL_STATUS.CANCELED) return 'cancelled';
    if (status === RENTAL_STATUS.COMPLETED) return 'completed';
    return 'active'; // "Bekliyor" ve "Teslim Edildi"
  }

  #getCutoffDate(range: DateRangeFilter): Date | null {
    if (range === 'all') return null;
    const date = new Date();
    if (range === '30days') date.setDate(date.getDate() - 30);
    else if (range === '3months') date.setMonth(date.getMonth() - 3);
    else if (range === '6months') date.setMonth(date.getMonth() - 6);
    else if (range === '1year') date.setFullYear(date.getFullYear() - 1);
    return date;
  }

  #loadRentals(): void {
    this.loading.set(true);
    this.#http
      .getResource<CustomerRentalHistoryResponseModel>(
        '/rent/customer-portal/rentals',
      )
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.stats.set(res.data.stats);
            this.rentals.set(res.data.rentals ?? []);
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
