import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BreadcrumbModel,
  BreadcrumbService,
} from '../../../services/breadcrumb';
import { httpResource } from '@angular/common/http';
import { Result } from '../../../models/result.model';
import { CategoryModel, initialCategory } from '../../../models/category.model';
import Blank from '../../../components/blank/blank';

@Component({
  imports: [Blank],
  templateUrl: './detail.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Detail {
  readonly id = signal<string>('');
  readonly breadcrumbs = signal<BreadcrumbModel[]>([]);

  readonly #activated = inject(ActivatedRoute);
  readonly #breadcrumb = inject(BreadcrumbService);

  readonly result = httpResource<Result<CategoryModel>>(
    () => `/rent/categories/${this.id()}`,
  );
  readonly data = computed(() => this.result.value()?.data ?? initialCategory);
  readonly loading = computed(() => this.result.isLoading());
  readonly pageTitle = computed(() => this.data()?.name ?? 'Kategori Detay');

  constructor() {
    this.#activated.params.subscribe((res) => {
      this.id.set(res['id']);
    });

    effect(() => {
      const breadcrumbs: BreadcrumbModel[] = [
        {
          title: 'Kategoriler',
          icon: 'bi-tags',
          url: '/categories',
          isActive: true,
        },
      ];

      if (this.data()) {
        this.breadcrumbs.set(breadcrumbs);
        this.breadcrumbs.update((prev) => [
          ...prev,
          {
            title: this.data().name,
            icon: 'bi-zoom-in',
            url: `/categories/detail/${this.id()}`,
            isActive: true,
          },
        ]);
        this.#breadcrumb.Reset(this.breadcrumbs());
      }
    });
  }
}
