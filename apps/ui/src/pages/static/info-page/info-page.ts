import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InfoPageContent } from './info-page.model';

@Component({
  imports: [RouterLink],
  templateUrl: './info-page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InfoPages {
  readonly #route = inject(ActivatedRoute);

  readonly content = this.#route.snapshot.data['content'] as InfoPageContent;
}
