import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import BookingSearchForm from '../booking/components/booking-search-form/booking-search-form';

@Component({
  imports: [BookingSearchForm],
  templateUrl: './home.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {}
