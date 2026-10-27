import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  resource,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import Blank from '../../../components/blank/blank';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import {
  BreadcrumbModel,
  BreadcrumbService,
} from '../../../services/breadcrumb';
import {
  initialReservationModel,
  ReservationModel,
} from '../../../models/reservation.model';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../services/http';
import { FlexiToastService } from 'flexi-toast';
import { DatePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { FlexiPopupModule } from 'flexi-popup';
import {
  CustomerModel,
  initialCustomerModel,
} from '../../../models/customer.model';
import { httpResource } from '@angular/common/http';
import { ODataModel } from '../../../models/odata.model';
import { FlexiGridModule, FlexiGridService, StateModel } from 'flexi-grid';
import { BranchModel } from '../../../models/branch.model';
import { FlexiSelectModule } from 'flexi-select';
import { Common } from '../../../services/common';
import {
  initialVehicleModel,
  VehicleModel,
} from '../../../models/vehicle.model';
import { TrCurrencyPipe } from 'tr-currency';
import { CategoryModel } from '../../../models/category.model';
import { fuelTypes, transmissions } from '../../vehicles/create/create';
import { VehiclePipe } from '../../../pipes/vehicle-pipe';
import { ProtectionPackageModel } from '../../../models/protection-package.model';
import { ExtraModel } from '../../../models/extra.model';

@Component({
  imports: [
    Blank,
    FormsModule,
    FormValidateDirective,
    NgxMaskDirective,
    NgClass,
    FlexiPopupModule,
    FlexiGridModule,
    NgxMaskPipe,
    NgTemplateOutlet,
    FlexiSelectModule,
    DatePipe,
    TrCurrencyPipe,
    VehiclePipe,
  ],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export default class Create {
  readonly id = signal<string | undefined>(undefined);
  readonly bredcrumbs = signal<BreadcrumbModel[]>([
    {
      title: 'Rezervasyonlar',
      icon: 'bi-calendar-check',
      url: '/reservations',
    },
  ]);
  readonly pageTitle = computed(() =>
    this.id() ? 'Rezervasyon Güncelle' : 'Rezervasyon Ekle',
  );
  readonly pageIcon = computed(() => (this.id() ? 'bi-pen' : 'bi-plus'));
  readonly btnName = computed(() =>
    this.id() ? 'Rezervasyonu Güncelle' : 'Rezervasyon Oluştur',
  );
  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      if (!this.id()) return null;
      const res = await lastValueFrom(
        this.#http.getResource<ReservationModel>(
          `/rent/reservations/${this.id()}`,
        ),
      );
      this.bredcrumbs.update((prev) => [
        ...prev,
        {
          title: res.data!.customer.fullName,
          icon: 'bi-pen',
          url: `/reservation/edit/${this.id()}`,
          isActive: true,
        },
      ]);
      this.#breadcrumb.Reset(this.bredcrumbs());

      const customer = res.data!.customer;

      this.selectedCustomer.set({
        ...initialCustomerModel,
        id: res.data!.customerId,
        fullName: customer.fullName,
        address: customer.fullAddress,
        phoneNumber: customer.phoneNumber,
        email: customer.email,
      });

      const vehicle = res.data!.vehicle;
      this.selectedVehicle.set({
        ...initialVehicleModel,
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        modelYear: vehicle.modelYear,
        color: vehicle.color,
        categoryName: vehicle.categoryName,
        fuelType: vehicle.fuelType,
        seatCount: vehicle.seatCount,
        tractionType: vehicle.tractionType,
        kilometer: vehicle.kilometer,
        imageUrl: vehicle.imageUrl,
        dailyPrice: res.data!.vehicleDailyPrice,
        transmission: vehicle.transmission,
      });
      this.vehicles.set([{ ...this.selectedVehicle()! }]);

      let totalExtra = 0;
      res.data!.reservationExtras.forEach(val => {
        totalExtra += (val.price * res.data!.totalDay)});
        this.totalExtra.set(totalExtra);

      return res.data;
    },
  });
  readonly data = linkedSignal(
    () => this.result.value() ?? { ...initialReservationModel },
  );
  readonly loading = linkedSignal(() => this.result.isLoading());

  isCustomerPopupVisible = false;
  readonly isCustomerPopupLoading = signal<boolean>(false);
  readonly customerPopupData = signal<CustomerModel>({
    ...initialCustomerModel,
  });
  readonly customerState = signal<StateModel>(new StateModel());
  readonly customersResult = httpResource<ODataModel<CustomerModel>>(() => {
    let endpoint = '/rent/odata/customers?count=true&';
    const part = this.#grid.getODataEndpoint(this.customerState());
    endpoint += part;
    return endpoint;
  });

  readonly customersData = computed(
    () => this.customersResult.value()?.value ?? [],
  );
  readonly customersTotal = computed(
    () => this.customersResult.value()?.['@odata.count'] ?? 0,
  );
  readonly customersLoading = computed(() => this.customersResult.isLoading());
  readonly selectedCustomer = signal<CustomerModel | undefined>(undefined);
  readonly branchesResult = httpResource<ODataModel<BranchModel>>(
    () => '/rent/odata/branches',
  );
  readonly branchesData = computed(
    () => this.branchesResult.value()?.value ?? [],
  );
  readonly branchesLoading = computed(() => this.branchesResult.isLoading());
  readonly isAdmin = computed(() => this.#common.decode().role === 'sys_admin');
  readonly timeData = signal<string[]>(
    Array.from({ length: 31 }, (_, i) => {
      const hour = 9 + Math.floor(i / 2);
      const minute = i % 2 === 0 ? '00' : '30';
      return `${hour.toString().padStart(2, '0')}:${minute}`;
    }),
  );

  readonly branchName = linkedSignal(() => this.#common.decode().branch);
  readonly vehicles = signal<VehicleModel[]>([]);
  readonly vehicleLoading = signal<boolean>(false);
  readonly categoryResult = httpResource<ODataModel<CategoryModel>>(
    () => '/rent/odata/categories',
  );
  readonly categoriesData = computed(
    () => this.categoryResult.value()?.value ?? [],
  );
  readonly categoriesLoading = computed(() => this.categoryResult.isLoading());
  readonly fuelTypes = computed(() => fuelTypes);
  readonly transmissions = computed(() => transmissions);
  readonly selectedVehicle = signal<VehicleModel | undefined>(undefined);

  readonly protectionPackagesResult = httpResource<
    ODataModel<ProtectionPackageModel>
  >(() => '/rent/odata/protection-packages');
  readonly protectionPackagesData = computed(
    () => this.protectionPackagesResult.value()?.value ?? [],
  );
  readonly protectionPackagesLoading = computed(() =>
    this.protectionPackagesResult.isLoading(),
  );

  readonly extrasResult = httpResource<ODataModel<ExtraModel>>(
    () => '/rent/odata/extras',
  );
  readonly extrasData = computed(() => this.extrasResult.value()?.value ?? []);
  readonly extrasLoading = computed(() => this.extrasResult.isLoading());
  readonly totalExtra = signal<number>(0);

  readonly vehicleFilter = signal<{
    categoryName: string;
    fuelType: string;
    transmission: string;
  }>({
    categoryName: '',
    fuelType: '',
    transmission: '',
  });

  readonly #breadcrumb = inject(BreadcrumbService);
  readonly #activated = inject(ActivatedRoute);
  readonly #http = inject(HttpService);
  readonly #toast = inject(FlexiToastService);
  readonly #router = inject(Router);
  readonly #date = inject(DatePipe);
  readonly #grid = inject(FlexiGridService);
  readonly #common = inject(Common);

  constructor() {
    this.#activated.params.subscribe((res) => {
      if (res['id']) {
        this.id.set(res['id']);
      } else {
        this.bredcrumbs.update((prev) => [
          ...prev,
          {
            title: 'Ekle',
            icon: 'bi-plus',
            url: '/reservation/add',
            isActive: true,
          },
        ]);
        this.#breadcrumb.Reset(this.bredcrumbs());
      }
    });

    const today = new Date();
    const date = this.#date.transform(today, 'yyyy-MM-dd')!;

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextDate = this.#date.transform(tomorrow, 'yyyy-MM-dd')!;

    this.customerPopupData.update((prev) => ({
      ...prev,
      dateOfBirth: date,
      driverLicenceIssueDate: date,
    }));

    this.#breadcrumb.Reset(this.bredcrumbs());

    this.data.update((prev) => ({
      ...prev,
      pickUpDate: date,
      deliveryDate: nextDate,
    }));

    this.calculateDayDifference();
  }

  save(form: NgForm) {
    if (!form.valid) return;

    this.loading.set(true);
    if (!this.id()) {
      const cardInformation = { ...this.data().creditCardInformation };
      cardInformation.ccv = cardInformation.ccv.toString();
      this.data.update((prev) => ({
        ...prev,
        reservationCreditCard: { ...cardInformation },
      })); 
      this.#http.post<string>(
        '/rent/reservations',
        this.data(),
        (res) => {
          this.#toast.showToast('Başarılı', res, 'success');
          this.#router.navigateByUrl('/reservations');
          this.loading.set(false);
        },
        () => this.loading.set(false),
      );
    } else {
      this.#http.put<string>(
        '/rent/reservations',
        this.data(),
        (res) => {
          this.#toast.showToast('Başarılı', res, 'info');
          this.#router.navigateByUrl('/reservations');
          this.loading.set(false);
        },
        () => this.loading.set(false),
      );
    }
  }

  saveCustomer(form: NgForm) {
    if (!form.valid) return;

    this.loading.set(true);
    this.#http.post<string>(
      '/rent/customers',
      this.customerPopupData(),
      (res) => {
        this.#toast.showToast('Başarılı', res, 'success');
        this.loading.set(false);
      },
      () => this.loading.set(false),
    );
  }

  customerDataStateChange(state: StateModel) {
    this.customerState.set(state);
  }

  selectCustomer(item: CustomerModel) {
    this.selectedCustomer.set(item);
    this.data.update((prev) => ({ ...prev, customerId: item.id }));
  }

  clearCustomer() {
    this.selectedCustomer.set(undefined);
    this.data.update((prev) => ({ ...prev, customerId: '' }));
  }

  displayDuration: string = '0 Gün';

  calculateDayDifference() {
    this.vehicles.set([]);

    const { pickUpDate, pickUpTime, deliveryDate, deliveryTime } = this.data();

    if (!pickUpDate || !pickUpTime || !deliveryDate || !deliveryTime) return;

    const pickUpMs = new Date(`${pickUpDate}T${pickUpTime}`).getTime();
    const deliveryMs = new Date(`${deliveryDate}T${deliveryTime}`).getTime();

    const diffMs = deliveryMs - pickUpMs;

    if (diffMs <= 0) {
      this.displayDuration = '0 Gün';
      this.data.update((prev) => ({ ...prev, totalDay: 0 }));
      return;
    }

    const oneHourMs = 60 * 60 * 1000;
    const totalHours = Math.ceil(diffMs / oneHourMs);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    let durationText = '';
    if (days > 0) durationText += `${days} Gün `;
    if (hours > 0) durationText += `${hours} Saat`;

    this.displayDuration = durationText.trim();

    this.data.update((prev) => ({ ...prev, totalDay: days }));
  }

  setLocation(id: any) {
    const branch = this.branchesData().find((i) => i.id === id)!;
    this.branchName.set(branch.name);
  }

  getVehicles() {
    if (this.isAdmin() && !this.data().pickUpLocationId) {
      this.#toast.showToast(
        'Uyarı',
        'Lütfen lokasyon seçimi yapınız.',
        'warning',
      );
      return;
    }
    const data = {
      branchId: !this.data().pickUpLocationId
        ? this.#common.decode().branchId
        : this.data().pickUpLocationId,
      pickUpDate: this.data().pickUpDate,
      pickUpTime: this.data().pickUpTime,
      deliveryDate: this.data().deliveryDate,
      deliveryTime: this.data().deliveryTime,
    };

    this.vehicleLoading.set(true);
    this.#http.post<VehicleModel[]>(
      '/rent/reservations/vehicle-getall',
      data,
      (res) => {
        this.vehicles.set(res);
        this.vehicleLoading.set(false);
      },
      () => this.vehicleLoading.set(false),
    );
  }

  getVehiclesImage(vehicle: VehicleModel) {
    const endpoint = 'https://localhost:7216/images/';
    return endpoint + vehicle.imageUrl;
  }

  selectVehicle(item: VehicleModel) {
    this.selectedVehicle.set(item);
    this.data.update((prev) => ({
      ...prev,
      vehicleId: item.id,
      vehicle: item,
      vehicleDailyPrice: item.dailyPrice,
    }));
    this.calculateTotal();
  }

  selectProtectionPackage(val: ProtectionPackageModel) {
    if (val.id === this.data().protectionPackageId) {
      this.data.update((prev) => ({
        ...prev,
        protectionPackageId: null,
        protectionPackagePrice: 0,
        protectionPackageName: null,
      }));
    } else {
      this.data.update((prev) => ({
        ...prev,
        protectionPackageId: val.id,
        protectionPackagePrice: val.price,
        protectionPackageName: val.name,
      }));
    }
    this.calculateTotal();
  }

  selectExtra(val: ExtraModel) {
    const extras = [...this.data().reservationExtras];
    const index = extras.findIndex((i) => i.extraId === val.id);

    if (index !== -1) {
      extras.splice(index, 1);
    } else {
      extras.push({ extraId: val.id, price: val.price, extraName: val.name });
    }

    this.data.update((prev) => ({ ...prev, reservationExtras: extras }));

    this.calculateTotal();
  }

  calculateTotal() {
    const totalVehicle = this.data().vehicleDailyPrice * this.data().totalDay;
    const totalProtectionPackage =
      this.data().protectionPackagePrice * this.data().totalDay;
    let totalExtra = 0;
    this.data().reservationExtras.forEach((val) => {
      totalExtra += val.price * this.data().totalDay;
    });
    this.totalExtra.set(totalExtra);
    const total = totalVehicle + totalProtectionPackage + totalExtra;
    this.data.update((prev) => ({
      ...prev,
      total,
    }));
  }

  checkedExtra(val: ExtraModel) {
    return this.data().reservationExtras.some((i) => i.extraId === val.id);
  }
}
