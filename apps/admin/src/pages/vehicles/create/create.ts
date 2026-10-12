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
import { DatePipe, NgClass } from '@angular/common';
import { initialVehicleModel, VehicleModel } from '../../../models/vehicle.model';
import { HttpService } from '../../../services/http';
import { FlexiToastService } from 'flexi-toast';
import { lastValueFrom } from 'rxjs';
import { httpResource } from '@angular/common/http';
import { FlexiSelectModule } from 'flexi-select';
import { ODataModel } from '../../../models/odata.model';
import { CategoryModel } from '../../../models/category.model';
import { BranchModel } from '../../../models/branch.model';

export interface FeatureGroup {
  group: string;
  features: { key: string; label: string; icon: string }[];
}

  export const brands = [
    'BMW',
    'Mercedes-Benz',
    'Audi',
    'Volkswagen',
    'Renault',
    'Fiat',
    'Hyundai',
    'Toyota',
    'Peugeot',
  ];

  export const modelYearList = Array.from(
    { length: 20 },
    (_, i) => new Date().getFullYear() + 1 - i,
  );

  export const colors = [
    'Beyaz',
    'Siyah',
    'Gri',
    'Gümüş',
    'Mavi',
    'Kırmızı',
    'Diğer',
  ];

  export const fuelTypes = [
    { name: 'Benzin', value: 'Benzin' },
    { name: 'Dizel', value: 'Dizel' },
    { name: 'LPG', value: 'LPG' },
    { name: 'Elektrik', value: 'Elektrik' },
    { name: 'Hibrit', value: 'Hibrit' },
  ];

  export const transmissions = [
    { name: 'Manuel', value: 'Manuel' },
    { name: 'Otomatik', value: 'Otomatik' },
    { name: 'CVT', value: 'CVT' },
  ];

  export const seatCounts = [
    { name: '2', value: 2 },
    { name: '4', value: 4 },
    { name: '5', value: 5 },
    { name: '7', value: 7 },
    { name: '8', value: 8 },
    { name: '9', value: 9 },
  ];

  export const featureGroups: FeatureGroup[] = [
    {
      group: 'Güvenlik Özellikleri',
      features: [
        { key: 'Airbag', label: 'Airbag', icon: 'bi-shield-check' },
        { key: 'ABS', label: 'ABS', icon: 'bi-shield-exclamation' },
        { key: 'ESP', label: 'ESP', icon: 'bi-shield-fill-check' },
        { key: 'Alarm Sistemi', label: 'Alarm Sistemi', icon: 'bi-bell' },
      ],
    },
    {
      group: 'Konfor Özellikleri',
      features: [
        { key: 'Klima', label: 'Klima', icon: 'bi-snow' },
        {
          key: 'Isıtmalı Koltuk',
          label: 'Isıtmalı Koltuk',
          icon: 'bi-thermometer-half',
        },
        { key: 'Sunroof', label: 'Sunroof', icon: 'bi-brightness-high' },
        { key: 'Bluetooth', label: 'Bluetooth', icon: 'bi-bluetooth' },
      ],
    },
    {
      group: 'Sürüş Destekleri',
      features: [
        { key: 'GPS Navigasyon', label: 'GPS Navigasyon', icon: 'bi-geo-alt' },
        { key: 'Park Sensörü', label: 'Park Sensörü', icon: 'bi-bullseye' },
        {
          key: 'Geri Görüş Kamerası',
          label: 'Geri Görüş Kamerası',
          icon: 'bi-camera',
        },
        {
          key: 'Cruise Control',
          label: 'Cruise Control',
          icon: 'bi-speedometer',
        },
      ],
    },
    {
      group: 'Multimedya',
      features: [
        {
          key: 'Dokunmatik Ekran',
          label: 'Dokunmatik Ekran',
          icon: 'bi-tablet',
        },
        { key: 'USB Bağlantısı', label: 'USB Bağlantısı', icon: 'bi-usb-plug' },
        {
          key: 'Premium Ses Sistemi',
          label: 'Premium Ses Sistemi',
          icon: 'bi-music-note',
        },
        { key: 'Apple CarPlay', label: 'Apple CarPlay', icon: 'bi-phone' },
      ],
    },
  ];

  export const tractionTypes = ['Önden Çekiş', 'Arkadan İtiş', '4x4'];
  export const tireStatuses = ['Çok İyi', 'İyi', 'Orta', 'Değişmeli'];
  export const generalStatuses = ['Mükemmel', 'İyi', 'Orta', 'Bakım Gerekli'];

@Component({
  imports: [
    Blank,
    FormsModule,
    FormValidateDirective,
    NgClass,
    FlexiSelectModule,
  ],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export default class Create {
  featuresInput = '';
  readonly insuranceTypes = signal<string[]>(['Sigorta', 'Kasko & Sigorta']);
  readonly modelYears = computed(() => modelYearList);
  readonly colors = computed(() => colors);
  readonly fuelTypes =  computed(() => fuelTypes);
  readonly transmissions = computed(() => transmissions);
  readonly seatCounts = computed(() => seatCounts);
  readonly featureGroups = computed(() => featureGroups);
  readonly tractionTypes = computed(() => tractionTypes);
  readonly tireStatuses = computed(() => tireStatuses);
  readonly generalStatuses = computed(() => generalStatuses);
  readonly brands = computed(() => brands);
  readonly id = signal<string | undefined>(undefined);
  readonly imageBaseUrl = 'https://localhost:7216/images/';

  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {
      title: 'Araçlar',
      icon: 'bi-car-front',
      url: '/vehicles',
      isActive: true,
    },
  ]);
  readonly categoriesResource = httpResource<ODataModel<CategoryModel>>(
    () => '/rent/odata/categories',
  );
  readonly branchesResource = httpResource<ODataModel<BranchModel>>(
    () => '/rent/odata/branches',
  );
  readonly categories = computed(
    () => this.categoriesResource.value()?.value ?? [],
  );
  readonly branches = computed(
    () => this.branchesResource.value()?.value ?? [],
  );

  readonly categoriesLoading = computed(() =>
    this.categoriesResource.isLoading(),
  );
  readonly branchesLoading = computed(() => this.branchesResource.isLoading());

  readonly pageTitle = computed(() =>
    this.id() ? 'Araç Güncelle' : 'Araç Ekle',
  );
  readonly pageIcon = computed(() => (this.id() ? 'bi-pen' : 'bi-plus'));
  readonly btnName = computed(() => (this.id() ? 'Güncelle' : 'Kaydet'));

  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      var res = await lastValueFrom(
        this.#http.getResource<VehicleModel>(`/rent/vehicles/${this.id()}`),
      );

      this.breadcrumbs.update((prev) => [
        ...prev,
        {
          title: `${res.data!.brand} ${res.data!.model}`,
          icon: 'bi-pen',
          url: `/vehicles/edit/${this.id()}`,
          isActive: true,
        },
      ]);
      this.#breadcrumb.Reset(this.breadcrumbs());

      const toDate = (v: string) => (v ? v.substring(0, 10) : '');
      const d = res.data!;
      return {
        ...d,
        lastMaintanceDate: toDate(d.lastMaintanceDate),
        inspectionDate: toDate(d.inspectionDate),
        insuranceEndDate: toDate(d.insuranceEndDate),
        cascoEndDate: toDate(d.cascoEndDate),
      };
    },
  });

  readonly data = linkedSignal(
    () => this.result.value() ?? { ...initialVehicleModel },
  );
  readonly loading = linkedSignal(() => this.result.isLoading());

  readonly file = signal<any | undefined>(undefined);
  readonly selectedPreview = signal<string>('');

  readonly imagePreview = computed(
    () =>
      this.selectedPreview() ||
      (this.data().imageUrl
        ? this.imageBaseUrl + this.data().imageUrl
        : undefined),
  );


  readonly #breadcrumb = inject(BreadcrumbService);
  readonly #activated = inject(ActivatedRoute);
  readonly #http = inject(HttpService);
  readonly #toast = inject(FlexiToastService);
  readonly #router = inject(Router);
  readonly #date = inject(DatePipe);

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
            url: '/vehicles/add',
            isActive: true,
          },
        ]);

        const date = this.#date.transform(new Date(), 'yyyy-MM-dd')!;
        this.data.update((prev) => ({
          ...prev,
          cascoEndDate: date,
          inspectionDate: date,
          insuranceEndDate: date,
          lastMaintanceDate: date,
        }));
        this.#breadcrumb.Reset(this.breadcrumbs());
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const selected = input.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      this.#toast.showToast(
        'Uyarı',
        'Lütfen bir resim dosyası seçiniz',
        'warning',
      );
      input.value = '';
      return;
    }

    this.file.set(selected);

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedPreview.set(reader.result as string);
    };
    reader.readAsDataURL(selected);

    input.value = '';
  }

  removeSelectedFile() {
    this.file.set(undefined);
    this.selectedPreview.set('');
  }

  toggleFeature(feature: string) {
    const features = this.data().features;
    if (features.includes(feature)) {
      this.data.update((prev) => ({
        ...prev,
        features: prev.features.filter((f) => f !== feature),
      }));
    } else {
      this.data.update((prev) => ({
        ...prev,
        features: [...prev.features, feature],
      }));
    }
  }

  isFeatureSelected(feature: string): boolean {
    return this.data().features.includes(feature);
  }

  save(form: NgForm) {
    if (!form.valid) return;

    this.loading.set(true);

    const formData = new FormData();
    const d = this.data();

    formData.append('Brand', d.brand);
    formData.append('Model', d.model);
    formData.append('ModelYear', d.modelYear.toString());
    formData.append('Color', d.color);
    formData.append('Plate', d.plate);
    formData.append('CategoryId', d.categoryId);
    formData.append('BranchId', d.branchId);
    formData.append('VinNumber', d.vinNumber);
    formData.append('EngineNumber', d.engineNumber);
    formData.append('Description', d.description);
    formData.append('FuelType', d.fuelType);
    formData.append('Transmission', d.transmission);
    formData.append('EngineVolume', d.engineVolume?.toString() ?? '0');
    formData.append('EnginePower', d.enginePower?.toString() ?? '0');
    formData.append('TractionType', d.tractionType);
    formData.append('FuelConsumption', d.fuelConsumption?.toString() ?? '0');
    formData.append('SeatCount', d.seatCount?.toString() ?? '0');
    formData.append('Kilometer', d.kilometer?.toString() ?? '0');
    formData.append('DailyPrice', d.dailyPrice?.toString() ?? '0');
    formData.append(
      'WeeklyDiscountRate',
      d.weeklyDiscountRate?.toString() ?? '0',
    );
    formData.append(
      'MonthlyDiscountRate',
      d.monthlyDiscountRate?.toString() ?? '0',
    );
    formData.append('InsuranceType', d.insuranceType);
    formData.append('LastMaintanceDate', d.lastMaintanceDate);
    formData.append('LastMaintanceKm', d.lastMaintanceKm?.toString() ?? '0');
    formData.append('NextMaintanceKm', d.nextMaintanceKm?.toString() ?? '0');
    formData.append('InspectionDate', d.inspectionDate);
    formData.append('InsuranceEndDate', d.insuranceEndDate);
    formData.append('CascoEndDate', d.cascoEndDate);
    formData.append('TireStatus', d.tireStatus);
    formData.append('GeneralStatus', d.generalStatus);
    formData.append('IsActive', d.isActive ? 'true' : 'false');

    if (d.features && d.features.length > 0) {
      d.features.forEach((f, index) =>
        formData.append(`Features[${index}]`, f),
      );
    }

    if (this.file()) {
      formData.append('File', this.file(), this.file().name);
    }

    if (this.id()) {
      formData.append('Id', this.id()!);
    }

    const endpoint = this.id() ? '/rent/vehicles' : '/rent/vehicles';
    const method = this.id() ? this.#http.put<string> : this.#http.post<string>;

    method.call(
      this.#http,
      endpoint,
      formData,
      (res) => {
        this.#toast.showToast('Başarılı', res, this.id() ? 'info' : 'success');
        this.#router.navigateByUrl('/vehicles');
        this.loading.set(false);
      },
      () => this.loading.set(false),
    );
  }

  changeStatus(status: boolean) {
    this.data.update((prev) => ({
      ...prev,
      isActive: status,
    }));
  }

  addFeature() {
    if (this.featuresInput.trim()) {
      this.data.update((prev) => ({
        ...prev,
        features: [...prev.features, this.featuresInput.trim()],
      }));
      this.featuresInput = '';
    }
  }
}
