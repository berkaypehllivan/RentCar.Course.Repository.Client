import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BreadcrumbService } from '../../../services/breadcrumb';
import Blank from '../../../components/blank/blank';
import { httpResource } from '@angular/common/http';
import { Result } from '../../../models/result.model';
import { TrCurrencyPipe } from 'tr-currency';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartType,
  registerables,
} from 'chart.js';

Chart.register(...registerables);

interface ChartsData {
  data: any[];
  borderColor: string[];
}

type RevenuePeriod = '7d' | '30d' | '3m' | '12m';

interface ChartPointDto {
  date: string;
  total: number;
}

const PERIOD_TEXT: Record<RevenuePeriod, string> = {
  '7d': 'Son 7 gün',
  '30d': 'Son 30 gün',
  '3m': 'Son 3 ay',
  '12m': 'Son 12 ay',
};

export interface BranchVehicleCountDto {
  branchId: string;
  branchName: string;
  vehicleCount: number;
}

export interface MonthlyIncomeDto {
  year: number;
  month: number;
  amount: number;
}

const capitalize = (text: string) =>
  text.charAt(0).toLocaleUpperCase('tr-TR') + text.slice(1);

@Component({
  imports: [Blank, TrCurrencyPipe],
  templateUrl: './dashboard.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Dashboard implements OnInit {
  //#region Rezervasyonlar

  readonly activeReservationCountResult = httpResource<Result<number>>(
    () => '/rent/dashboard/active-reservation-count',
  );
  readonly activeReservationCount = computed(
    () => this.activeReservationCountResult.value()?.data ?? 0,
  );
  readonly activeReservationCountLoading = computed(() =>
    this.activeReservationCountResult.isLoading(),
  );

  readonly pendingReservationCountResult = httpResource<Result<number>>(
    () => '/rent/dashboard/pending-reservation-count',
  );
  readonly pendingReservationCount = computed(
    () => this.pendingReservationCountResult.value()?.data ?? 0,
  );
  readonly pendingReservationCountLoading = computed(() =>
    this.pendingReservationCountResult.isLoading(),
  );

  readonly completedReservationCountResult = httpResource<Result<number>>(
    () => '/rent/dashboard/completed-reservation-count',
  );
  readonly completedReservationCount = computed(
    () => this.completedReservationCountResult.value()?.data ?? 0,
  );
  readonly completedReservationCountLoading = computed(() =>
    this.completedReservationCountResult.isLoading(),
  );

  readonly canceledReservationCountResult = httpResource<Result<number>>(
    () => '/rent/dashboard/canceled-reservation-count',
  );
  readonly canceledReservationCount = computed(
    () => this.canceledReservationCountResult.value()?.data ?? 0,
  );
  readonly canceledReservationCountLoading = computed(() =>
    this.canceledReservationCountResult.isLoading(),
  );

  readonly reservationStats = computed(() => [
    {
      key: 'active',
      label: 'Aktif Rezervasyonlar',
      count: this.activeReservationCount(),
      icon: 'bi-calendar-check',
      bg: 'bg-primary',
    },
    {
      key: 'pending',
      label: 'Bekleyen Rezervasyonlar',
      count: this.pendingReservationCount(),
      icon: 'bi-hourglass-split',
      bg: 'bg-warning',
    },
    {
      key: 'completed',
      label: 'Tamamlanan Rezervasyonlar',
      count: this.completedReservationCount(),
      icon: 'bi-check-circle',
      bg: 'bg-success',
    },
    {
      key: 'canceled',
      label: 'İptal Edilen Rezervasyonlar',
      count: this.canceledReservationCount(),
      icon: 'bi-x-circle',
      bg: 'bg-danger',
    },
  ]);

  //#endregion

  //#region Araçlar

  readonly branchVehicleCountsResult = httpResource<
    Result<BranchVehicleCountDto[]>
  >(() => '/rent/dashboard/branch-vehicle-counts');
  readonly branchVehicleCounts = computed(
    () => this.branchVehicleCountsResult.value()?.data ?? [],
  );
  readonly branchVehicleCountsLoading = computed(() =>
    this.branchVehicleCountsResult.isLoading(),
  );
  readonly totalVehicleCount = computed(() =>
    this.branchVehicleCounts().reduce((sum, b) => sum + b.vehicleCount, 0),
  );
  //#endregion

  //#region Gelir

  readonly currentYear = signal(new Date().getFullYear());
  readonly currentMonthName = signal(
    capitalize(new Date().toLocaleString('tr-TR', { month: 'long' })),
  );

  readonly monthlyIncomeResult = httpResource<Result<number>>(
    () => '/rent/dashboard/monthly-income',
  );
  readonly monthlyIncome = computed(
    () => this.monthlyIncomeResult.value()?.data ?? 0,
  );
  readonly monthlyIncomeLoading = computed(() =>
    this.monthlyIncomeResult.isLoading(),
  );

  readonly previousMonthsIncomeResult = httpResource<
    Result<MonthlyIncomeDto[]>
  >(() => '/rent/dashboard/previous-months-income');
  readonly previousMonthsIncome = computed(() =>
    (this.previousMonthsIncomeResult.value()?.data ?? []).map((m) => ({
      ...m,
      key: `${m.year}-${m.month}`,
      monthName: capitalize(
        new Date(m.year, m.month - 1, 1).toLocaleString('tr-TR', {
          month: 'long',
        }),
      ),
    })),
  );
  readonly previousMonthsIncomeLoading = computed(() =>
    this.previousMonthsIncomeResult.isLoading(),
  );

  readonly yearlyIncomeResult = httpResource<Result<number>>(
    () => '/rent/dashboard/yearly-income',
  );
  readonly yearlyIncome = computed(
    () => this.yearlyIncomeResult.value()?.data ?? 0,
  );
  readonly yearlyIncomeLoading = computed(() =>
    this.yearlyIncomeResult.isLoading(),
  );

  readonly expectedIncomeResult = httpResource<Result<number>>(
    () => '/rent/dashboard/expected-income',
  );
  readonly expectedIncome = computed(
    () => this.expectedIncomeResult.value()?.data ?? 0,
  );
  readonly expectedIncomeLoading = computed(() =>
    this.expectedIncomeResult.isLoading(),
  );

  //#endregion

  //#region Müşteriler

  readonly totalCustomerCountResult = httpResource<Result<number>>(
    () => '/rent/dashboard/total-customer-count',
  );
  readonly totalCustomerCount = computed(
    () => this.totalCustomerCountResult.value()?.data ?? 0,
  );
  readonly totalCustomerCountLoading = computed(() =>
    this.totalCustomerCountResult.isLoading(),
  );

  //#endregion

  //#region Chart

  readonly period = signal<RevenuePeriod>('7d');
  readonly isMonthly = computed(
    () => this.period() === '3m' || this.period() === '12m',
  );

  readonly revenueChartResult = httpResource<Result<ChartPointDto[]>>(
    () => `/rent/dashboard/revenue-chart?period=${this.period()}`,
  );
  
readonly chartCanvas1 =
    viewChild.required<ElementRef<HTMLCanvasElement>>('revenueChartCanvas');

  readonly res1 = computed<ChartsData>(() => {
    const points = this.revenueChartResult.value()?.data ?? [];
    return {
      data: points.map((p) => ({
        date: this.formatLabel(p.date),
        total: p.total,
      })),
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
      ],
    };
  });

  #revenueChart?: Chart;

  onPeriodChange(event: Event) {
    this.period.set((event.target as HTMLSelectElement).value as RevenuePeriod);
  }

  private formatLabel(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(y, m - 1, d); // new Date('2026-10-29') UTC parse edilir, bu yüzden parçalayarak oluşturuyoruz
    return this.isMonthly()
      ? date.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })
      : date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
  }

  constructor() {
    effect(() => {
      if (!this.revenueChartResult.hasValue()) return; // veri gelmeden çizme

      this.#revenueChart = this.createChart(
        this.#revenueChart,
        this.chartCanvas1(),
        'line',
        this.res1(),
        this.isMonthly() ? 'Aylık Kazanç (₺)' : 'Günlük Kazanç (₺)',
        `${PERIOD_TEXT[this.period()]} Kazanç Dağılımı`,
      );
    });
  }

  createChart(
    chart: Chart | undefined,
    canvas: ElementRef<HTMLCanvasElement>,
    type: ChartType,
    res: ChartsData,
    label: string,
    text: string,
    symbol: string = ' ₺',
  ): Chart | undefined {
    chart?.destroy();

    const ctx = canvas.nativeElement.getContext('2d');
    if (!ctx) return undefined;

    const config: ChartConfiguration = {
      type,
      data: {
        labels: res.data.map((item) => item.date),
        datasets: [
          {
            label,
            data: res.data.map((item) => item.total),
            // line grafiğinde çizgi rengi tek renk olmalı; dizi bar/doughnut için anlamlı
            backgroundColor:
              type === 'line' ? res.borderColor[0] : res.borderColor,
            borderColor: type === 'line' ? res.borderColor[0] : res.borderColor,
            borderWidth: 3,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text },
          legend: { display: true, position: 'top' },
        },
        scales:
          type !== 'doughnut'
            ? {
                y: {
                  beginAtZero: true,
                  ticks: { callback: (value) => value + symbol },
                },
              }
            : {},
      },
    };

    return new Chart(ctx, config);
  }

  //#endregion

  readonly #breadcrumb = inject(BreadcrumbService);

  ngOnInit(): void {
    this.#breadcrumb.SetDashboard();
  }

  // ngAfterViewInit(): void {
  //   this.createChart(
  //     this.chart1(),
  //     this.chartCanvas1(),
  //     'line',
  //     this.res1(),
  //     'Günlük Kazanç Dağılımı (₺)',
  //     'Haftalık Kazanç Dağılımı',
  //   );
  //   this.createChart(
  //     this.chart2(),
  //     this.chartCanvas2(),
  //     'line',
  //     this.res2(),
  //     'Günlük Rezervasyon',
  //     'Haftalık Rezervasyon',
  //     '',
  //   );
  // }
}
