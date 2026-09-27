import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FlexiGridModule } from 'flexi-grid';
import { BreadcrumbModel } from '../../services/breadcrumb';
import { Common } from '../../services/common';
import Grid from '../../components/grid/grid';

@Component({
  imports: [Grid, FlexiGridModule],
  templateUrl: './protection-packages.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProtectionPackages {
  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {
      title: 'Koruma Paketleri',
      icon: 'bi-shield-check',
      url: '/protection-packages',
      isActive: true,
    },
  ]);

  readonly #common = inject(Common);

  checkPermission(permission: string) {
    return this.#common.checkPermission(permission);
  }
}
