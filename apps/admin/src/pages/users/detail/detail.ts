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
import { UserModel, initialUser } from '../../../models/user.model';
import Blank from '../../../components/blank/blank';
import { NgxMaskPipe } from 'ngx-mask';

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

  readonly result = httpResource<Result<UserModel>>(
    () => `/rent/Users/${this.id()}`,
  );
  readonly data = computed(() => this.result.value()?.data ?? initialUser);
  readonly loading = computed(() => this.result.isLoading());
  readonly pageTitle = computed(() => this.data()?.firstName + " " + this.data()?.lastName);

  constructor() {
    this.#activated.params.subscribe((res) => {
      this.id.set(res['id']);
    });

    effect(() => {
      const breadcrumbs: BreadcrumbModel[] = [
        {
          title: 'Kullanıcılar',
          icon: 'bi-people',
          url: '/users',
          isActive: true,
        },
      ];

      if (this.data()) {
        this.breadcrumbs.set(breadcrumbs);

        this.breadcrumbs.update((prev) => [
          ...prev,
          {
            title: this.data().fullName,
            icon: 'bi-zoom-in',
            url: `/Users/edit/${this.id()}`,
            isActive: true,
          },
        ]);
        this.#breadcrumb.Reset(this.breadcrumbs());
      }
    });
  }
}
