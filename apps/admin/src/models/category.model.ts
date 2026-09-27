import { EntityModel } from './entity.model';

export interface CategoryModel extends EntityModel {
  name: string;
}

export const initialCategory: CategoryModel = {
  id: '',
  name: '',
  createdAt: '',
  createdBy: '',
  updatedAt: '',
  updatedBy: '',
  isActive: true,
  createdFullName: '',
  updatedFullName: '',
};