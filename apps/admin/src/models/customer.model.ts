import { EntityModel } from './entity.model';

export interface CustomerModel extends EntityModel {
  firstName: string;
  lastName: string;
  identityNumber: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  address: string;
  driverLicenceIssueDate: string; // Sonradan eklediğimiz alan
}

export const initialCustomerModel: CustomerModel = {
  id: '',
  firstName: '',
  lastName: '',
  identityNumber: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
  address: '',
  driverLicenceIssueDate: '',
  createdAt: '',
  createdBy: '',
  createdFullName: '',
  updatedAt: '',
  updatedBy: '',
  updatedFullName: '',
  isActive: true,
};