import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ProfileStateService } from '../profile-state';
import { TokenService } from '@shared/lib/services/token';
import { CustomerCommon } from '../../../services/customer-common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

function formatMemberSince(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Layout implements OnInit {
  readonly #profile = inject(ProfileStateService);
  readonly #token = inject(TokenService);
  readonly #common = inject(CustomerCommon);
  readonly #router = inject(Router);

  readonly profile = this.#profile.profile;
  readonly loading = this.#profile.loading();

  readonly memberSince = computed(() =>
    formatMemberSince(this.profile()?.createdAt),
  );

  ngOnInit() {
    this.#profile.loadProfile();
  }

  logout() {
    this.#token.clearToken();
    this.#common.clearDecode();
    this.#profile.clear();
    this.#router.navigateByUrl('/');
  }
}
