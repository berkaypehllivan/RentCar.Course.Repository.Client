import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TokenService } from '@shared/lib/services/token';
import { CustomerCommon } from '../../services/customer-common';

@Component({
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Layout implements OnInit {
  readonly common = inject(CustomerCommon);
  readonly #tokenService = inject(TokenService);
  readonly #router = inject(Router);

  readonly isDropdownOpen = signal<boolean>(false);

  ngOnInit() {
    const token = this.#tokenService.getToken();
    if (token) this.common.decodeToken(token);
  }

  logout() {
    this.#tokenService.clearToken();
    this.common.clearDecode();
    this.#router.navigateByUrl('/login');
  }

  toggleDropdown() {
    this.isDropdownOpen.update((v) => !v);
  }

  closeDropdown() {
    this.isDropdownOpen.set(false);
  }
}
