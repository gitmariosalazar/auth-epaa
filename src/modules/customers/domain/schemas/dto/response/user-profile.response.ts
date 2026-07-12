import { UUID } from 'crypto';

export interface UserProfileResponse {
  // Client Data
  userId: UUID;
  clientId: string;
  email: string;
  registerDate: Date;
  company: CompanyResponse | null;
  person: ClientResponse | null;
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
  isDeceased: boolean;
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

export interface PhoneResponse {
  telefonoid: number;
  numero: string;
}

export interface EmailResponse {
  emailId: number;
  email: string;
}
