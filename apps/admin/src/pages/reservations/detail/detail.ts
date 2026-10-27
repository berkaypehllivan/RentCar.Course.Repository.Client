import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { TrCurrencyPipe } from 'tr-currency';
import { BreadcrumbModel, BreadcrumbService } from '../../../services/breadcrumb';
import Blank from '../../../components/blank/blank';
import { ReservationModel, initialReservationModel } from '../../../models/reservation.model';
import { Result } from '../../../models/result.model';
import { DatePipe, NgClass } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
    imports: [
        Blank,
        TrCurrencyPipe,
        DatePipe,
        NgClass,
        NgxMaskPipe
    ],
    templateUrl: './detail.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ReservationDetail {
    readonly id = signal<string>('');
    readonly bredcrumbs = signal<BreadcrumbModel[]>([]);
    readonly result = httpResource<Result<ReservationModel>>(() => `/rent/reservations/${this.id()}`);
    readonly data = computed(() => this.result.value()?.data ?? initialReservationModel);
    readonly loading = computed(() => this.result.isLoading());
    readonly pageTitle = signal<string>("Rezervasyon Detay");

    readonly #activated = inject(ActivatedRoute);
    readonly #breadcrumb = inject(BreadcrumbService);

    constructor() {
        this.#activated.params.subscribe(res => {
            this.id.set(res['id']);
        });

        effect(() => {
            const breadCrumbs: BreadcrumbModel[] = [
                {
                    title: 'Rezervasyonlar',
                    icon: 'bi-calendar-check',
                    url: '/reservation'
                }
            ];

            if (this.data()) {
                this.bredcrumbs.set(breadCrumbs);
                this.bredcrumbs.update(prev => [...prev, {
                    title: this.data().reservationNumber,
                    icon: 'bi-zoom-in',
                    url: `/reservation/detail/${this.id()}`,
                    isActive: true
                }]);
                this.#breadcrumb.Reset(this.bredcrumbs());
            }
        });
    }

    getStatusClass(){
        switch(this.data().status){
            case 'Bekliyor': return 'bg-warning';
            case 'Teslim Edildi': return 'bg-info';
            case 'Tamamlandı': return 'bg-success';
            case 'İptal Edildi': return 'bg-danger';
            default: return ''
        }
    }
}