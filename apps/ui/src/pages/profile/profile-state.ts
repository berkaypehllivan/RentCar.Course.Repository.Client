import { inject, Injectable, signal } from '@angular/core';
import { HttpService } from '@shared/lib/services/http';
import { CustomerModel } from '@shared/lib/models/customer.model';

@Injectable({ providedIn: 'root' })
export class ProfileStateService {
  readonly #http = inject(HttpService);

  readonly profile = signal<CustomerModel | null>(null);
  readonly loading = signal<boolean>(false);

  loadProfile(): void {
    this.loading.set(true);

    this.#http
      .getResource<CustomerModel>('/rent/customer-portal/profile')
      .subscribe({
        next: (res) => {
          this.profile.set(res.data ?? null);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  clear(): void {
    this.profile.set(null);
  }
}
