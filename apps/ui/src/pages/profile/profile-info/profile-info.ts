import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpService } from '@shared/lib/services/http';
import { ProfileStateService } from '../profile-state';
import { CustomerCommon } from '../../../services/customer-common';
import {
  CustomerModel,
  CustomerProfileUpdateModel,
} from '@shared/lib/models/customer.model';
import { NgxMaskPipe, NgxMaskDirective } from 'ngx-mask';
import { FlexiToastService } from 'flexi-toast';

function formatLastUpdated(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

@Component({
  imports: [FormsModule, NgxMaskPipe, NgxMaskDirective],
  templateUrl: './profile-info.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileInfo {
  readonly #http = inject(HttpService);
  readonly #profile = inject(ProfileStateService);
  readonly #common = inject(CustomerCommon);
  readonly #toast = inject(FlexiToastService);

  readonly profile = this.#profile.profile;
  readonly loading = this.#profile.loading;

  readonly firstName = signal<string>('');
  readonly lastName = signal<string>('');
  readonly dateOfBirth = signal<string>('');
  readonly email = signal<string>('');
  readonly phoneNumber = signal<string>('');
  readonly city = signal<string>('');
  readonly district = signal<string>('');
  readonly fullAddress = signal<string>('');
  readonly driverLicenceIssueDate = signal<string>('');

  readonly submitting = signal<boolean>(false);

  readonly lastUpdatedText = computed(() => {
    const p = this.profile();
    return formatLastUpdated(p?.updatedAt ?? p?.createdAt);
  });

  constructor() {
    effect(() => {
      const data = this.profile();
      if (data) this.#patchForm(data);
    });
  }

  submit(form: NgForm): void {
    if (!form.valid || this.submitting()) return;

    const payload: CustomerProfileUpdateModel = {
      firstName: this.firstName().trim(),
      lastName: this.lastName().trim(),
      dateOfBirth: this.dateOfBirth(),
      email: this.email().trim(),
      phoneNumber: this.phoneNumber().trim(),
      city: this.city().trim(),
      district: this.district().trim(),
      fullAddress: this.fullAddress().trim(),
      driverLicenceIssueDate: this.driverLicenceIssueDate(),
    };

    this.submitting.set(true);

    this.#http.put<string>(
      '/rent/customer-portal/profile',
      payload,
      (message) => {
        this.submitting.set(false);
        this.#toast.showToast('Başarılı', message);
        const current = this.profile();
        if (current) {
          const updatedFullName = `${payload.firstName} ${payload.lastName}`;
          this.#profile.profile.set({
            ...current,
            ...payload,
            fullName: updatedFullName,
            updatedAt: new Date().toISOString(),
          });

          this.#common.decode.update((prev) => ({
            ...prev,
            fullName: updatedFullName,
            email: payload.email,
          }));
        }
      },
      () => {
        this.submitting.set(false);
        this.#toast.showToast(
          'Hata',
          'Bilgiler güncellenirken bir hata oluştu. Lütfen kontrol edip tekrar deneyin.',
        );
      },
    );
  }

  #patchForm(data: CustomerModel) {
    this.firstName.set(data.firstName);
    this.lastName.set(data.lastName);
    this.dateOfBirth.set(data.dateOfBirth);
    this.email.set(data.email);
    this.phoneNumber.set(data.phoneNumber);
    this.city.set(data.city);
    this.district.set(data.district);
    this.fullAddress.set(data.fullAddress);
    this.driverLicenceIssueDate.set(data.driverLicenceIssueDate);
  }
}
