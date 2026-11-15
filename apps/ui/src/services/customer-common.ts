import { computed, Injectable, signal } from '@angular/core';
import {
  CustomerDecodeModel,
  initialCustomerDecode,
} from '@shared/lib/models/customer.decode.model';
import {decodeJwt, isTokenExpired} from "@shared/lib/services/token.decoder";

@Injectable({ providedIn: 'root' })
export class CustomerCommon {
  readonly decode = signal<CustomerDecodeModel>({ ...initialCustomerDecode });
  readonly isLoggedIn = computed(() => !!this.decode().id);

  decodeToken(token:string):boolean {
    try{
        const decoded: any = decodeJwt(token);

        if(isTokenExpired(decoded)){
            this.clearDecode();
            return false;
        }

        this.decode.set({
            id:decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? '',
            email: decoded['email'] ?? '',
            fullName: decoded['fullName'] ?? '',
        });
        return true;
    } catch{
        this.clearDecode();
        return false;
    }
  }

  clearDecode():void {
    this.decode.set({...initialCustomerDecode});
  }
}
