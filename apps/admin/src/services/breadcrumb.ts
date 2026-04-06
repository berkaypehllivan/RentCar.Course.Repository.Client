import { Injectable, signal } from '@angular/core';

export interface BreadcrumbModel{
  title:string;
  url:string;
  icon:string;
  isActive?:boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  readonly data = signal<BreadcrumbModel[]>([]);

  Reset(){
    const dashboard: BreadcrumbModel = {
      title: 'Dashboard',
      url: '/',
      icon: 'bi-speedometer2'
    }

    this.data.set([{...dashboard}]);
  }
  
  SetDashboard(){
    const dashboard: BreadcrumbModel = {
      title: 'Dashboard',
      url: '/',
      icon: 'bi-speedometer2',
      isActive: true
    }

    this.data.set([{...dashboard}]);
  }

  Set(breadcrumbs: BreadcrumbModel[]){
    this.data.update(prev => [...prev, ...breadcrumbs]);
  }

}
