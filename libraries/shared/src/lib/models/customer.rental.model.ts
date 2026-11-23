export interface CustomerRentalStatsModel {
  totalRentals: number;
  activeRentals: number;
  totalDays: number;
  totalSpent: number;
}

export interface CustomerRentalItemModel {
  id: string;
  reservationNumber: string;
  status: string;
  pickUpDate: string;
  pickUpTime: string;
  deliveryDate: string;
  deliveryTime: string;
  totalDay: number;
  total: number;
  pickUpLocationName: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleImageUrl: string;
  vehicleTransmission: string;
  vehicleFuelType: string;
  vehicleSeatCount: number;
  createdAt: string;
}

export interface CustomerRentalHistoryResponseModel {
  stats: CustomerRentalStatsModel;
  rentals: CustomerRentalItemModel[];
}

export interface CustomerRentalExtraModel {
  name: string;
  price: number;
}

export interface CustomerRentalVehicleModel {
  brand: string;
  model: string;
  modelYear: number;
  plate: string;
  imageUrl: string;
  transmission: string;
  fuelType: string;
  seatCount: number;
}

export interface CustomerRentalBranchModel {
  name: string;
  fullAddress: string;
  phoneNumber: string;
}

export interface CustomerRentalDriverModel {
  fullName: string;
  maskedIdentityNumber: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
}

export interface CustomerRentalPaymentModel {
  maskedCardNumber: string;
  cardOwner: string;
}

export interface CustomerRentalDetailModel {
  id: string;
  reservationNumber: string;
  status: string;
  pickUpDate: string;
  pickUpTime: string;
  deliveryDate: string;
  deliveryTime: string;
  totalDay: number;
  vehicleDailyPrice: number;
  vehicleTotalPrice: number;
  protectionPackageName?: string | null;
  protectionPackagePrice: number;
  extras: CustomerRentalExtraModel[];
  extrasTotalPrice: number;
  total: number;
  note?: string | null;
  createdAt: string;
  vehicle: CustomerRentalVehicleModel;
  branch: CustomerRentalBranchModel;
  driver: CustomerRentalDriverModel;
  payment: CustomerRentalPaymentModel;
}