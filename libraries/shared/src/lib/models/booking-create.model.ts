export interface BookingPaymentModel {
  cardNumber: string;
  cardOwner: string;
  expiry: string;
  ccv: string;
}

export interface BookingCreateModel {
  pickUpLocationId: string;
  pickUpDate: string;
  pickUpTime: string;
  deliveryDate: string;
  deliveryTime: string;
  vehicleId: string;
  protectionPackageId: string;
  extraIds: string[];
  note: string | null;
  paymentInformation: BookingPaymentModel;
}
