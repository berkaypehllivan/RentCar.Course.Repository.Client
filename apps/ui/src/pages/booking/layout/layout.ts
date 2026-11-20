import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

const STEP_MAP: Record<string, number> = {
  'vehicle-selection': 1,
  'protection-packages': 2,
  'pricing-extras': 3,
  'driver-details': 4,
};

@Component({
  imports: [RouterOutlet],
  templateUrl: './layout.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Layout {
  readonly #router = inject(Router);

  private readonly currentUrl = toSignal(
    this.#router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.#router.url),
    ),
    { initialValue: this.#router.url },
  );

  readonly currentStep = computed(() => {
    const url = this.currentUrl();
    const segment = Object.keys(STEP_MAP).find((key) => url.includes(key));
    return segment ? STEP_MAP[segment] : 1;
  });
}
