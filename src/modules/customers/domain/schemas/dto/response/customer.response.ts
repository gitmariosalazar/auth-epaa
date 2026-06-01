export interface CustomerResponse {
  customerUserId: string;
  clientId: string;
  email: string;
  authMethod: string;
  authProvider?: string | null;
  customerStatusId: number;
  isActive: boolean;
  failedAttempts: number;
  isLockedOut: boolean;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  telefonoVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedAt?: Date | null;
}
