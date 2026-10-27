import { EntityModel } from './entity.model';

export interface ReservationPickUpModel {
  name: string;
  fullAddress: string;
  phoneNumber: string;
}

export interface ReservationCustomerModel {
  fullName: string;
  identityNumber: string;
  phoneNumber: string;
  email: string;
  fullAddress: string;
}

export interface ReservationVehicleModel {
  id: string;
  brand: string;
  model: string;
  modelYear: number;
  plate: string;
  color: string;
  categoryName: string;
  fuelType: string;
  seatCount: number;
  tractionType: string;
  kilometer: number;
  imageUrl: string;
  transmission: string;
}

export interface ReservationExtraModel {
  extraId: string;
  extraName: string;
  price: number;
}

export interface ReservationCreditCardModel {
  cardNumber: string;
  cardOwner: string;
  expiry: string;
  ccv: string;
}

export interface ReservationPaymentInformationModel {
  cardNumber: string;
  cardOwner: string;
}

export interface ReservationHistoriesModel{
  title:string;
  description:string;
  createdAt:string;
}[]

export interface ReservationModel extends EntityModel {
  reservationNumber: string;
  customerId: string;
  customer: ReservationCustomerModel;
  pickUpLocationId?: string;
  pickUp: ReservationPickUpModel;
  pickUpDate: string;
  pickUpTime: string;
  pickUpDateTime: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryDateTime: string;
  vehicleId: string;
  vehicleDailyPrice: number;
  vehicle: ReservationVehicleModel;
  protectionPackageId?: string | null;
  protectionPackagePrice: number;
  protectionPackageName?: string | null;
  reservationExtras: ReservationExtraModel[];
  note: string;
  status: string;
  totalDay: number;
  total: number;
  creditCardInformation: ReservationCreditCardModel;
  paymentInformation: ReservationPaymentInformationModel;
  histories: ReservationHistoriesModel[];
}

export const initialReservationModel: ReservationModel = {
  reservationNumber: '',
  id: '',
  customerId: '',
  customer: {
    fullName: '',
    identityNumber: '',
    phoneNumber: '',
    email: '',
    fullAddress: '',
  },
  pickUp: {
    name: '',
    fullAddress: '',
    phoneNumber: '',
  },
  pickUpDate: '',
  pickUpTime: '09:00:00',
  pickUpDateTime: '',
  deliveryDate: '',
  deliveryTime: '10:00:00',
  deliveryDateTime: '',
  vehicleId: '',
  vehicleDailyPrice: 0,
  vehicle: {
    id: '',
    brand: '',
    model: '',
    modelYear: 0,
    plate: '',
    color: '',
    categoryName: '',
    fuelType: '',
    seatCount: 0,
    tractionType: '',
    kilometer: 0,
    imageUrl: '',
    transmission: '',
  },
  protectionPackagePrice: 0,
  reservationExtras: [],
  note: '',
  status: '',
  totalDay: 0,
  creditCardInformation: {
    cardNumber: '',
    cardOwner: '',
    expiry: '',
    ccv: '',
  },
  paymentInformation: {
    cardNumber: '',
    cardOwner: '',
  },
  histories: [],
  total: 0,
  createdAt: '',
  createdBy: '',
  createdFullName: '',
  isActive: true,
};
