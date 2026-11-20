import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BookingSearchCriteriaModel,
  BranchOptionModel,
} from '@shared/lib/models/available-vehicle.model';
import { HttpService } from '@shared/lib/services/http';
import { criteriaToQueryParams, isPickUpInPast, isValidPeriod, todayAsDateInput } from '../../booking-criteria';


@Component({
  selector: 'app-booking-search-form',
  imports: [FormsModule],
  templateUrl: './booking-search-form.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BookingSearchForm implements OnInit {
  readonly initialCriteria = input<BookingSearchCriteriaModel | undefined>(
    undefined,
  );

  readonly branches = signal<BranchOptionModel[]>([]);
  readonly branchId = signal<string>('');
  readonly pickUpDate = signal<string>('');
  readonly pickUpTime = signal<string>('10:00');
  readonly deliveryDate = signal<string>('');
  readonly deliveryTime = signal<string>('10:00');
  readonly error = signal<string | null>(null);
  readonly today = todayAsDateInput();

  readonly #http = inject(HttpService);
  readonly #router = inject(Router);

  constructor() {
    effect(() => {
      const criteria = this.initialCriteria();
      if (!criteria || !criteria.branchId) return;

      this.branchId.set(criteria.branchId);
      this.pickUpDate.set(criteria.pickUpDate);
      this.pickUpTime.set(criteria.pickUpTime.slice(0, 5));
      this.deliveryDate.set(criteria.deliveryDate);
      this.deliveryTime.set(criteria.deliveryTime.slice(0, 5));
    });
  }
  ngOnInit(): void {
    this.#http
      .getResource<BranchOptionModel[]>('/rent/booking/branches')
      .subscribe({
        next: (res) => {
          const branches = res.data ?? [];
          this.branches.set(branches);
          if (!this.branchId() && branches.length > 0)
            this.branchId.set(branches[0].id);
        },
      });
  }

  search(form: NgForm) {
    if (!form.valid) return;

    const criteria: BookingSearchCriteriaModel = {
      branchId: this.branchId(),
      pickUpDate: this.pickUpDate(),
      pickUpTime: `${this.pickUpTime()}:00`,
      deliveryDate: this.deliveryDate(),
      deliveryTime: `${this.deliveryTime()}:00`,
    };
    if (isPickUpInPast(criteria)) {
      this.error.set('Alış tarihi bugünden önce olamaz.');
      return;
    }
    if (!isValidPeriod(criteria)) {
      this.error.set('Dönüş tarihi, alış tarihinden sonra olmalıdır.');
      return;
    }

    this.error.set(null);
    this.#router.navigate(['/booking/vehicle-selection'], {
      queryParams: criteriaToQueryParams(criteria),
    });
  }
}
