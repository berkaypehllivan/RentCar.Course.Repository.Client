export interface UserDecodeModel {
  id: string;
  fullName: string;
  fullNameWithEmail: string;
  email: string;
  role: string;
  permissions: string[];
  branch: string;
  branchId: string;
}

export const initialDecode: UserDecodeModel = {
  id: '',
  fullName: '',
  fullNameWithEmail: '',
  email: '',
  role: '',
  permissions: [],
  branch: '',
  branchId: '',
};
