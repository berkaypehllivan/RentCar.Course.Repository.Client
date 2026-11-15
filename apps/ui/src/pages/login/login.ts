import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpService } from '@shared/lib/services/http';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { TokenService } from '@shared/lib/services/token';
import { NgClass } from '@angular/common';
import { CustomerCommon } from '../../services/customer-common';

@Component({
  imports: [RouterLink, FormsModule, FormValidateDirective, NgClass],
  templateUrl: './login.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Login {
  readonly loading = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);
  readonly rememberMe = signal<boolean>(false);

  readonly email = signal<string>('');

  readonly #http = inject(HttpService);
  readonly #router = inject(Router);
  readonly #token = inject(TokenService);
  readonly #common = inject(CustomerCommon);

  login(form: NgForm) {
    if (!form.valid) return;

    this.loading.set(true);
    this.#http.post<{ token: string }>(
      '/rent/auth/customer-login',
      form.value,
      (res) => {
        this.#token.setToken(res.token, this.rememberMe());
        this.#common.decodeToken(res.token);
        this.#router.navigateByUrl('/');
        this.loading.set(false);
      },
      () => this.loading.set(false),
    );
  }

  togglePasswordVisibility() {
    this.showPassword.update((v) => !v);
  }
}
