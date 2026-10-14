import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  effect,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Blank from '../../../components/blank/blank';
import { Result } from '../../../models/result.model';
import {
  initialCustomerModel,
  CustomerModel,
} from '../../../models/customer.model';
import {
  BreadcrumbModel,
  BreadcrumbService,
} from '../../../services/breadcrumb';

@Component({
  imports: [Blank, CommonModule],
  templateUrl: './detail.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CustomerDetail {
  readonly id = signal<string>('');
  readonly breadcrumbs = signal<BreadcrumbModel[]>([]);
  
  // Endpoint Backend yapına göre /customers veya /api/customers olabilir
  readonly result = httpResource<Result<CustomerModel>>(
    () => `/rent/customers/${this.id()}`,
  );
  
  readonly data = computed(
    () => this.result.value()?.data ?? initialCustomerModel,
  );
  
  readonly loading = computed(() => this.result.isLoading());
  readonly pageTitle = signal<string>('Müşteri Detay');

  readonly #activated = inject(ActivatedRoute);
  readonly #breadcrumb = inject(BreadcrumbService);

  constructor() {
    this.#activated.params.subscribe((res) => {
      this.id.set(res['id']);
    });

    effect(() => {
      const bCrumbs: BreadcrumbModel[] = [
        {
          title: 'Müşteriler',
          icon: 'bi-person-vcard',
          url: '/customers',
        },
      ];

      if (this.data() && this.data().id) {
        this.breadcrumbs.set(bCrumbs);
        this.breadcrumbs.update((prev) => [
          ...prev,
          {
            title: `${this.data().firstName} ${this.data().lastName}`,
            icon: 'bi-zoom-in',
            url: `/customers/detail/${this.id()}`,
            isActive: true,
          },
        ]);
        this.#breadcrumb.Reset(this.breadcrumbs());
      }
    });
  }
}