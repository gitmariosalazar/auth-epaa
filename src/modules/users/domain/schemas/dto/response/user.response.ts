export interface UserResponse {
  userId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  sexId?: number;
  cardId?: string;
  citizenId?: string;
  positionId?: number;
  contractTypeId?: number;
  employeeStatusId?: number;
  hireDate?: Date;
  terminationDate?: Date;
  baseSalary?: number;
  supervisorId?: string;
  assignedZones?: number[];
  driverLicense?: string;
  hasCompanyVehicle?: boolean;
  internalPhone?: string;
  internalEmail?: string;
  photoUrl?: string;
  createdBy?: string;
  registeredAt: Date;
  lastLogin?: Date | null;
  failedAttempts?: number;
  twoFactorEnabled?: boolean;
  isActive: boolean;
  observations?: string | null;
}

export interface UserResponseWithRolesAndPermissionsResponse extends UserResponse {
  passwordHash?: string;
  roles: string[];
  permissions: string[];
}

export interface UserResponseWithRolesResponse extends UserResponse {
  roles: string[];
}

export interface UserResponseWithPermissionsResponse extends UserResponse {
  permissions: string[];
}
