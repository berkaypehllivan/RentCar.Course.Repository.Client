import { EntityModel } from './entity.model';

export interface CustomerModel extends EntityModel {
  firstName: string;
  lastName: string;
  fullName: string;
  identityNumber: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  city: string;
  district: string;
  fullAddress: string;
  driverLicenceIssueDate: string;
  totalReservationCount?: number;
}

export type CustomerProfileUpdateModel = Pick<
  CustomerModel,
  | 'firstName'
  | 'lastName'
  | 'dateOfBirth'
  | 'email'
  | 'phoneNumber'
  | 'city'
  | 'district'
  | 'fullAddress'
  | 'driverLicenceIssueDate'
>;
export const initialCustomerModel: CustomerModel = {
  id: '',
  firstName: '',
  lastName: '',
  fullName: '',
  identityNumber: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
  city: '',
  district: '',
  fullAddress: '',
  driverLicenceIssueDate: '',
  createdAt: '',
  createdBy: '',
  createdFullName: '',
  updatedAt: '',
  updatedBy: '',
  updatedFullName: '',
  isActive: true,
};
