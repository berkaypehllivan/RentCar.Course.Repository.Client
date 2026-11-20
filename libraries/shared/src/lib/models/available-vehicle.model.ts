export interface AvailableVehicleModel {
  id: string;
  brand: string;
  model: string;
  modelYear: number;
  categoryName: string;
  transmission: string;
  fuelType: string;
  seatCount: number;
  imageUrl: string;
  dailyPrice: number;
  totalDay: number;
  totalPrice: number;
}

export interface BranchOptionModel {
  id:string;
  name:string;
}

export interface BookingSearchCriteriaModel {
  branchId: string;
  pickUpDate: string;
  pickUpTime: string;
  deliveryDate: string;
  deliveryTime: string;
}

export const initialBookingSearchCriteria: BookingSearchCriteriaModel = {
  branchId: '',
  pickUpDate: '',
  pickUpTime: '10:00:00',
  deliveryDate: '',
  deliveryTime: '10:00:00',
};
