import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  resource,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import Blank from '../../../components/blank/blank';
import {
  BreadcrumbModel,
  BreadcrumbService,
} from '../../../services/breadcrumb';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { NgClass } from '@angular/common';
import { initialUser, UserModel } from '../../../models/user.model';
import { HttpService } from '../../../services/http';
import { FlexiToastService } from 'flexi-toast';
import { lastValueFrom } from 'rxjs';
import { httpResource } from '@angular/common/http';
import { ODataModel } from '../../../models/odata.model';
import { BranchModel } from '../../../models/branch.model';
import { RoleModel } from '../../../models/role.model';
import { FlexiSelectModule } from 'flexi-select';
import { Common } from '../../../services/common';

@Component({
  imports: [Blank, FormsModule, FormValidateDirective, NgClass,FlexiSelectModule],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Create {
  readonly id = signal<string | undefined>(undefined);

  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {
      title: 'Kullanıcılar',
      icon: 'bi-people',
      url: '/users',
      isActive: true,
    },
  ]);

  readonly pageTitle = computed(() =>
    this.id() ? 'Kullanıcı Güncelle' : 'Kullanıcı Ekle',
  );
  readonly pageIcon = computed(() => (this.id() ? 'bi-pen' : 'bi-plus'));
  readonly btnName = computed(() => (this.id() ? 'Güncelle' : 'Kaydet'));
  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      var res = await lastValueFrom(
        this.#http.getResource<UserModel>(`/rent/users/${this.id()}`),
      );

      this.breadcrumbs.update((prev) => [
        ...prev,
        {
          title: res.data!.fullName,
          icon: 'bi-pen',
          url: `/users/edit/${this.id()}`,
          isActive: true,
        },
      ]);
      this.#breadcrumb.Reset(this.breadcrumbs());
      return res.data;
    },
  });

  readonly data = linkedSignal(() => this.result.value() ?? { ...initialUser });
  readonly loading = linkedSignal(() => this.result.isLoading());
  readonly branchResult = httpResource<ODataModel<BranchModel>>(
    () => '/rent/odata/branches',
  );
  readonly branches = computed(() => this.branchResult.value()?.value ?? []);
  readonly branchLoading = computed(() => this.branchResult.isLoading());

  readonly roleResult = httpResource<ODataModel<RoleModel>>(
    () => '/rent/odata/roles',
  );
  readonly roles = computed(() => this.roleResult.value()?.value ?? []);
  readonly roleLoading = computed(() => this.roleResult.isLoading());

  readonly #breadcrumb = inject(BreadcrumbService);
  readonly #activated = inject(ActivatedRoute);
  readonly #http = inject(HttpService);
  readonly #toast = inject(FlexiToastService);
  readonly #router = inject(Router);
  readonly #common = inject(Common);

  constructor() {
    this.#activated.params.subscribe((res) => {
      if (res['id']) {
        this.id.set(res['id']);
      } else {
        this.breadcrumbs.update((prev) => [
          ...prev,
          {
            title: 'Ekle',
            icon: 'bi-plus',
            url: '/users/add',
            isActive: true,
          },
        ]);
        this.#breadcrumb.Reset(this.breadcrumbs());
      }
    });
  }

  save(form: NgForm) {
    if (!form.valid) return;

    if (!this.id()) {
      this.loading.set(true);
      this.#http.post<string>(
        '/rent/users',
        this.data(),
        (res) => {
          this.#toast.showToast('Başarılı', res, 'success');
          this.#router.navigateByUrl('/users');
          this.loading.set(false);
        },
        () => this.loading.set(false),
      );
    } else {
      this.loading.set(true);
      this.#http.put<string>(
        '/rent/users',
        this.data(),
        (res) => {
          this.#toast.showToast('Başarılı', res, 'info');
          this.#router.navigateByUrl('/users');
          this.loading.set(false);
        },
        () => this.loading.set(false),
      );
    }
  }

  changeStatus(status: boolean) {
    this.data.update((prev) => ({
      ...prev,
      isActive: status,
    }));
  }

  checkIsAdmin(){
    return this.#common.decode().role === "sys_admin";
  }
}
