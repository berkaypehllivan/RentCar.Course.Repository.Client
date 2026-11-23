import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpService } from '@shared/lib/services/http';
import { TokenService } from '@shared/lib/services/token';
import { CustomerCommon } from '../../../services/customer-common';
import { ProfileStateService } from '../profile-state';
import { FlexiToastService } from 'flexi-toast';

type PasswordField = 'current' | 'new' | 'confirm';

const PASSWORD_RULES = [
  {
    key: 'length',
    label: 'En az 8 karakter',
    test: (v: string) => v.length >= 8,
  },
  {
    key: 'lowercase',
    label: 'Küçük harf (a-z)',
    test: (v: string) => /[a-z]/.test(v),
  },
  {
    key: 'uppercase',
    label: 'Büyük harf (A-Z)',
    test: (v: string) => /[A-Z]/.test(v),
  },
  { key: 'number', label: 'Rakam (0-9)', test: (v: string) => /[0-9]/.test(v) },
];

@Component({
  imports: [FormsModule, RouterLink],
  templateUrl: './change-password.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChangePassword {
  readonly #http = inject(HttpService);
  readonly #router = inject(Router);
  readonly #tokenService = inject(TokenService);
  readonly #customerCommon = inject(CustomerCommon);
  readonly #profileState = inject(ProfileStateService);
  readonly #toast = inject(FlexiToastService);

  readonly currentPassword = signal('');
  readonly newPassword = signal('');
  readonly confirmPassword = signal('');

  readonly show = signal<Record<PasswordField, boolean>>({
    current: false,
    new: false,
    confirm: false,
  });
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly requirements = computed(() =>
    PASSWORD_RULES.map((r) => ({
      key: r.key,
      label: r.label,
      met: r.test(this.newPassword()),
    })),
  );

  readonly strength = computed(() => {
    const value = this.newPassword();
    const metCount = this.requirements().filter((r) => r.met).length;

    if (!value) return { level: 0, label: '' };
    if (metCount <= 2) return { level: 1, label: 'Zayıf' };
    if (metCount === 3) return { level: 2, label: 'Orta' };
    return /[^A-Za-z0-9]/.test(value)
      ? { level: 4, label: 'Çok güçlü' }
      : { level: 3, label: 'Güçlü' };
  });

  readonly passwordsMatch = computed(
    () =>
      !!this.confirmPassword() && this.newPassword() === this.confirmPassword(),
  );

  readonly passwordsMismatch = computed(
    () =>
      !!this.confirmPassword() && this.newPassword() !== this.confirmPassword(),
  );

  readonly sameAsCurrent = computed(
    () => !!this.newPassword() && this.newPassword() === this.currentPassword(),
  );

  readonly canSubmit = computed(
    () =>
      !this.loading() &&
      !!this.currentPassword() &&
      this.requirements().every((r) => r.met) &&
      this.passwordsMatch() &&
      !this.sameAsCurrent(),
  );

  toggle(field: PasswordField) {
    this.show.update((s) => ({ ...s, [field]: !s[field] }));
  }

  submit(): void {
    if (!this.canSubmit()) return;

    this.loading.set(true);

    this.#http.put<string>(
      '/rent/customer-portal/change-password',
      {
        currentPassword: this.currentPassword(),
        newPassword: this.newPassword(),
      },
      (message) => {
        this.#tokenService.clearToken();
        this.#customerCommon.clearDecode();
        this.#profileState.clear();
        this.#toast.showToast('Başarılı', message);
        this.#router.navigateByUrl('/login');
      },
      () => this.loading.set(false),
    );
  }
}
