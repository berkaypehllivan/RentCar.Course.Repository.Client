import { EntityModel } from './entity.model';

export interface ProtectionPackageModel extends EntityModel {
  name: string;
  price: number;
  isRecommended: boolean;
  orderNumber:number;
  coverages: string[];
}

export const initialProtectionPackageModel: ProtectionPackageModel = {
  id: '',
  name: '',
  price: 0,
  isRecommended: false,
  orderNumber: 0,
  coverages: [],
  createdAt: '',
  createdBy: '',
  updatedAt: '',
  updatedBy: '',
  isActive: true,
  createdFullName: '',
  updatedFullName: '',
};
