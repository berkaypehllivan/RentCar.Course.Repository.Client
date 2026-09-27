import {
  ChangeDetectionStrategy,  Component,  computed,  inject,  linkedSignal,  resource,  signal,  ViewEncapsulation,} from '@angular/core';
import Blank from '../../../components/blank/blank';
import {
  BreadcrumbModel,
  BreadcrumbService,
} from '../../../services/breadcrumb';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { NgClass } from '@angular/common';
import {
  initialProtectionPackageModel,
  ProtectionPackageModel,
} from '../../../models/protection-package.model';
import { HttpService } from '../../../services/http';
import { FlexiToastService } from 'flexi-toast';
import { lastValueFrom } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  imports: [Blank, FormsModule, FormValidateDirective, NgClass,NgxMaskDirective],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Create {
  readonly id = signal<string | undefined>(undefined);

  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {
      title: 'Koruma Paketleri',
      icon: 'bi-shield-check',
      url: '/protection-packages',
      isActive: true,
    },
  ]);

  readonly pageTitle = computed(() =>
    this.id() ? 'Koruma Paketi Güncelle' : 'Koruma Paketi Ekle',
  );
  readonly pageIcon = computed(() => (this.id() ? 'bi-pen' : 'bi-plus'));
  readonly btnName = computed(() => (this.id() ? 'Güncelle' : 'Kaydet'));
  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      const res = await lastValueFrom(
        this.#http.getResource<ProtectionPackageModel>(
          `/rent/protection-packages/${this.id()}`,
        ),
      );

      this.breadcrumbs.update((prev) => [
        ...prev,
        {
          title: res.data!.name,
          icon: 'bi-pen',
          url: `/protection-packages/edit/${this.id()}`,
          isActive: true,
        },
      ]);
      this.#breadcrumb.Reset(this.breadcrumbs());
      return res.data;
    },
  });

  readonly data = linkedSignal(
    () => this.result.value() ?? { ...initialProtectionPackageModel },
  );
  readonly loading = linkedSignal(() => this.result.isLoading());
  coveragesInput = '';

  readonly #breadcrumb = inject(BreadcrumbService);
  readonly #activated = inject(ActivatedRoute);
  readonly #http = inject(HttpService);
  readonly #toast = inject(FlexiToastService);
  readonly #router = inject(Router);

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
            url: '/protection-packages/add',
            isActive: true,
          },
        ]);
        this.#breadcrumb.Reset(this.breadcrumbs());
      }
    });
  }

  save(form: NgForm) {
    if (!form.valid) return;

    const payload: ProtectionPackageModel = {
      ...this.data(),
      coverages: [...this.data().coverages],
    };

    this.loading.set(true);
    if (!this.id()) {
      this.#http.post<string>(
        '/rent/protection-packages',
        payload,
        (res) => {
          this.#toast.showToast('Başarılı', res, 'success');
          this.#router.navigateByUrl('/protection-packages');
          this.loading.set(false);
        },
        () => this.loading.set(false),
      );
    } else {
      this.#http.put<string>(
        '/rent/protection-packages',
        payload,
        (res) => {
          this.#toast.showToast('Başarılı', res, 'info');
          this.#router.navigateByUrl('/protection-packages');
          this.loading.set(false);
        },
        () => this.loading.set(false),
      );
    }
  }

  changeStatus(status: boolean) {
    this.data.update((prev) => ({
      ...prev,
      isActive: status,
    }));
  }

  changeRecommended(status: boolean) {
    this.data.update((prev) => ({
      ...prev,
      isRecommended: status,
    }));
  }

  addCoverage() {
    const coverage = this.coveragesInput.trim();
    if (!coverage) return;

    this.data.update((prev) => ({
      ...prev,
      coverages: [...prev.coverages, coverage],
    }));
    this.coveragesInput = '';
  }

  removeCoverage(index: number) {
    this.data.update((prev) => ({
      ...prev,
      coverages: prev.coverages.filter((_, coverageIndex) => coverageIndex !== index),
    }));
  }
}
