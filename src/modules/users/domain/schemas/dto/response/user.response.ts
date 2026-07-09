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
  positionName?: string;
  contractTypeName?: string;
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

export interface PhoneResponse {
  telefonoId: number;
  numero: string;
}

export interface EmailResponse {
  correoElectronicoId: number;
  correo: string;
}

export interface ClientResponse {
  address: string;
  country: string;
  genderId: number;
  lastName: string;
  parishId: string;
  personId: string;
  birthDate: string;
  firstName: string;
  isDeceased: boolean | null | number;
  professionId: number;
  civilStatusId: number;
  phones: PhoneResponse[];
  emails: EmailResponse[];
}

export interface CompanyResponse {
  ruc: string;
  address: string;
  country: string;
  clientId: string;
  parishId: string;
  companyId: number;
  businessName: string;
  commercialName: string;
  phones: PhoneResponse[];
  emails: EmailResponse[];
}

export interface CustomerWithRolesAndPermissionsResponse {
  userId: string;
  username: string;
  email: string;
  registeredAt: Date;
  lastLogin?: Date | null;
  failedAttempts?: number;
  twoFactorEnabled?: boolean;
  isActive: boolean;
  observations?: string | null;
  passwordHash?: string | null;
  company: CompanyResponse | null;
  person: ClientResponse | null;
  roles: string[];
  permissions: string[];
}
