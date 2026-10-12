import { EntityModel } from './entity.model';

export interface VehicleModel extends EntityModel {
  brand: string;
  model: string;
  modelYear: number;
  color: string;
  plate: string;
  categoryId: string;
  branchId: string;
  vinNumber: string;
  engineNumber: string;
  description: string;
  imageUrl: string;
  fuelType: string;
  transmission: string;
  engineVolume: number;
  enginePower: number;
  tractionType: string;
  fuelConsumption: number;
  seatCount: number;
  kilometer: number;
  dailyPrice: number;
  weeklyDiscountRate: number;
  monthlyDiscountRate: number;
  insuranceType: string;
  lastMaintanceDate: string;
  lastMaintanceKm: number;
  nextMaintanceKm: number;
  inspectionDate: string;
  insuranceEndDate: string;
  cascoEndDate: string;
  tireStatus: string;
  generalStatus: string;
  features: string[];
  branchName?:string;
  categoryName?:string;
}

export const initialVehicleModel: VehicleModel = {
  id: '',
  brand: '',
  model: '',
  modelYear: 0,
  color: '',
  plate: '',
  categoryId: '',
  branchId: '',
  vinNumber: '',
  engineNumber: '',
  description: '',
  imageUrl: '',
  fuelType: '',
  transmission: '',
  engineVolume: 0,
  enginePower: 0,
  tractionType: '',
  fuelConsumption: 0,
  seatCount: 0,
  kilometer: 0,
  dailyPrice: 0,
  weeklyDiscountRate: 0,
  monthlyDiscountRate: 0,
  insuranceType: '',
  lastMaintanceDate: '',
  lastMaintanceKm: 0,
  nextMaintanceKm: 0,
  inspectionDate: '',
  insuranceEndDate: '',
  cascoEndDate: '',
  tireStatus: '',
  generalStatus: '',
  features: [],
  createdAt: '',
  createdBy: '',
  createdFullName: '',
  updatedAt: '',
  updatedBy: '',
  updatedFullName: '',
  isActive: true,
};
