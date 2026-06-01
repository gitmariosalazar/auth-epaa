export class UpdateCustomerRequest {
  email?: string;
  customerStatusId?: number;
  twoFactorEnabled?: boolean;
  emailVerified?: boolean;
  telefonoVerified?: boolean;
  updatedBy?: string;

  constructor(params?: {
    email?: string;
    customerStatusId?: number;
    twoFactorEnabled?: boolean;
    emailVerified?: boolean;
    telefonoVerified?: boolean;
    updatedBy?: string;
  }) {
    if (params) {
      this.email = params.email;
      this.customerStatusId = params.customerStatusId;
      this.twoFactorEnabled = params.twoFactorEnabled;
      this.emailVerified = params.emailVerified;
      this.telefonoVerified = params.telefonoVerified;
      this.updatedBy = params.updatedBy;
    }
  }
}
