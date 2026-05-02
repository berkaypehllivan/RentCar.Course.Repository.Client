import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  resource,
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
import { BranchModel, initialBranch } from '../../../models/branch.model';
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

  readonly result = httpResource<Result<BranchModel>>(
    () => `/rent/branches/${this.id()}`,
  );
  readonly data = computed(() => this.result.value()?.data ?? initialBranch);
  readonly loading = computed(() => this.result.isLoading());
  readonly pageTitle = computed(()=> this.data()?.name ?? "Şube Detay");

  constructor() {
    this.#activated.params.subscribe((res) => {
      this.id.set(res['id']);
    });

    effect(() => {
      const breadcrumbs: BreadcrumbModel[] = [
        {
          title: 'Şubeler',
          icon: 'bi-buildings',
          url: '/branches',
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
            url: `/branches/edit/${this.id()}`,
            isActive: true,
          },
        ]);
        this.#breadcrumb.Reset(this.breadcrumbs());
      }
    });
  }
}
