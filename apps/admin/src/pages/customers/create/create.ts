import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  resource,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import Blank from '../../../components/blank/blank';
import { BreadcrumbModel, BreadcrumbService } from '../../../services/breadcrumb';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { DatePipe, NgClass } from '@angular/common';
import { initialCustomerModel, CustomerModel } from '../../../models/customer.model';
import { HttpService } from '../../../services/http';
import { FlexiToastService } from 'flexi-toast';
import { lastValueFrom } from 'rxjs';

@Component({
  imports: [
    Blank,
    FormsModule,
    FormValidateDirective,
    NgClass,
  ],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export default class Create {
  readonly id = signal<string | undefined>(undefined);

  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {
      title: 'Müşteriler',
      icon: 'bi-people',
      url: '/customers',
      isActive: true,
    },
  ]);

  readonly pageTitle = computed(() => (this.id() ? 'Müşteri Güncelle' : 'Müşteri Ekle'));
  readonly pageIcon = computed(() => (this.id() ? 'bi-pen' : 'bi-plus'));
  readonly btnName = computed(() => (this.id() ? 'Güncelle' : 'Kaydet'));

  readonly #breadcrumb = inject(BreadcrumbService);
  readonly #activated = inject(ActivatedRoute);
  readonly #http = inject(HttpService);
  readonly #toast = inject(FlexiToastService);
  readonly #router = inject(Router);
  readonly #date = inject(DatePipe);

  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      // Eğer id yoksa (Ekleme modu) işlem yapma
      if (!this.id()) return { ...initialCustomerModel };

      var res = await lastValueFrom(
        this.#http.getResource<CustomerModel>(`/rent/customers/${this.id()}`),
      );

      this.breadcrumbs.update((prev) => [
        ...prev,
        {
          title: `${res.data!.firstName} ${res.data!.lastName}`,
          icon: 'bi-pen',
          url: `/customers/edit/${this.id()}`,
          isActive: true,
        },
      ]);
      this.#breadcrumb.Reset(this.breadcrumbs());

      // HTML type="date" inputları için yyyy-MM-dd formatına çevirme
      const toDate = (v: string) => (v ? v.substring(0, 10) : '');
      const d = res.data!;
      return {
        ...d,
        dateOfBirth: toDate(d.dateOfBirth),
        driverLicenseIssueDate: toDate(d.driverLicenceIssueDate),
      };
    },
  });

  readonly data = linkedSignal(
    () => this.result.value() ?? { ...initialCustomerModel },
  );
  readonly loading = linkedSignal(() => this.result.isLoading());

  constructor() {
    this.#activated.params.subscribe((res) => {
      if (res['id']) {
        this.id.set(res['id']);
      } else {
        this.breadcrumbs.update((prev) => [
          ...prev,
          {
            title: 'Ekle',
            icon: 'bi-plus',
            url: '/customers/add',
            isActive: true,
          },
        ]);

        const date = this.#date.transform(new Date(), 'yyyy-MM-dd')!;
        this.data.update((prev) => ({
          ...prev,
          dateOfBirth: date,
          driverLicenseIssueDate: date,
        }));
        this.#breadcrumb.Reset(this.breadcrumbs());
      }
    });
  }

  save(form: NgForm) {
    if (!form.valid) return;

    this.loading.set(true);

    const endpoint = '/rent/customers';
    const method = this.id() ? this.#http.put<string> : this.#http.post<string>;

    method.call(
      this.#http,
      endpoint,
      this.data(),
      (res) => {
        this.#toast.showToast('Başarılı', res, this.id() ? 'info' : 'success');
        this.#router.navigateByUrl('/customers');
        this.loading.set(false);
      },
      () => this.loading.set(false),
    );
  }

  changeStatus(status: boolean) {
    this.data.update((prev) => ({
      ...prev,
      isActive: status,
    }));
  }
}