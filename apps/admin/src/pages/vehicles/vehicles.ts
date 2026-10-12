import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FlexiGridFilterDataModel, FlexiGridModule } from 'flexi-grid';
import Grid from '../../components/grid/grid';
import { BreadcrumbModel } from '../../services/breadcrumb';
import { Common } from '../../services/common';
import { httpResource } from '@angular/common/http';
import { brands } from './create/create';
@Component({
  imports: [Grid, FlexiGridModule],
  templateUrl: './vehicles.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Vehicles {
  readonly bredcrumbs = signal<BreadcrumbModel[]>([
    {
      title: 'Araçlar',
      icon: 'bi-car-front',
      url: '/vehicles',
      isActive: true,
    },
  ]);

  readonly brandFilterData = computed<FlexiGridFilterDataModel[]>(() =>
    brands.map((val) => ({
      value: val,
      name: val,
    })),
  );

  readonly colorsResource = httpResource<string[]>(
    () => '/rent/odata/vehicles/colors',
  );
  readonly yearsResource = httpResource<string[]>(
    () => '/rent/odata/vehicles/years',
  );

  readonly colors = computed(() => this.colorsResource.value() ?? []);
  readonly years = computed(() => this.yearsResource.value() ?? []);

  readonly #common = inject(Common);

  checkPermission(permission: string) {
    return this.#common.checkPermission(permission);
  }
}
