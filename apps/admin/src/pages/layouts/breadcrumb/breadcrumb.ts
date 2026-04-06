import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { BreadcrumbService } from '../../../services/breadcrumb';
import { RouterLink } from "@angular/router";
import { NgClass } from '@angular/common';

@Component({
  imports: [RouterLink, NgClass],
  selector:'app-breadcrumb',
  templateUrl: './breadcrumb.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Breadcrumb {
readonly breadcrumb = inject(BreadcrumbService);
}
