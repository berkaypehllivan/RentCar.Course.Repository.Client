import {
  ChangeDetectionStrategy,Component,computed,inject,linkedSignal,resource,signal,ViewEncapsulation,} from '@angular/core';
import Blank from '../../../components/blank/blank';
import {  BreadcrumbModel,  BreadcrumbService,} from '../../../services/breadcrumb';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { NgClass } from '@angular/common';
import { CategoryModel, initialCategory } from '../../../models/category.model';
import { HttpService } from '../../../services/http';
import { FlexiToastService } from 'flexi-toast';
import { lastValueFrom } from 'rxjs';

@Component({
  imports: [Blank, FormsModule, FormValidateDirective, NgClass],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Create {
  readonly id = signal<string | undefined>(undefined);

  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {
      title: 'Kategoriler',
      icon: 'bi-tags',
      url: '/categories',
      isActive: true,
    },
  ]);

  readonly pageTitle = computed(() =>
    this.id() ? 'Kategori Güncelle' : 'Kategori Ekle',
  );
  readonly pageIcon = computed(() => (this.id() ? 'bi-pen' : 'bi-plus'));
  readonly btnName = computed(() => (this.id() ? 'Güncelle' : 'Kaydet'));
  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      const res = await lastValueFrom(
        this.#http.getResource<CategoryModel>(`/rent/categories/${this.id()}`),
      );

      this.breadcrumbs.update((prev) => [
        ...prev,
        {
          title: res.data!.name,
          icon: 'bi-pen',
          url: `/categories/edit/${this.id()}`,
          isActive: true,
        },
      ]);
      this.#breadcrumb.Reset(this.breadcrumbs());
      return res.data;
    },
  });

  readonly data = linkedSignal(
    () => this.result.value() ?? { ...initialCategory },
  );
  readonly loading = linkedSignal(() => this.result.isLoading());

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
            url: '/categories/add',
            isActive: true,
          },
        ]);
        this.#breadcrumb.Reset(this.breadcrumbs());
      }
    });
  }

  save(form: NgForm) {
    if (!form.valid) return;

    this.loading.set(true);
    if (!this.id()) {
      this.#http.post<string>(
        '/rent/categories',
        this.data(),
        (res) => {
          this.#toast.showToast('Başarılı', res, 'success');
          this.#router.navigateByUrl('/categories');
          this.loading.set(false);
        },
        () => this.loading.set(false),
      );
    } else {
      this.#http.put<string>(
        '/rent/categories',
        this.data(),
        (res) => {
          this.#toast.showToast('Başarılı', res, 'info');
          this.#router.navigateByUrl('/categories');
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
}
