import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpService } from '@shared/lib/services/http';
import { FlexiToastService } from 'flexi-toast';
import { FormValidateDirective } from 'form-validate-angular';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  imports: [RouterLink, FormsModule, FormValidateDirective, NgxMaskDirective],
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Register {
  readonly loading = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);
  readonly showConfirmPassword = signal<boolean>(false);

  readonly #http = inject(HttpService);
  readonly #router = inject(Router);
  readonly #toast = inject(FlexiToastService);

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update((v) => !v);
  }

  register(form: NgForm) {
    if (!form.valid) return;

    if (form.value.password != form.value.confirmPassword) {
      this.#toast.showToast('Hata', 'Şifreler eşleşmiyor.', 'error');
      return;
    }

    const { confirmPassword, agreeTerms, ...payload } = form.value;

    this.loading.set(true);
    this.#http.post<string>(
      '/rent/auth/customer-register',
      payload,
      (res) => {
        this.loading.set(false);
        this.#toast.showToast('Başarılı', res, 'info');
        this.#router.navigateByUrl('/login');
      },
      () => this.loading.set(false),
    );
  }
}
