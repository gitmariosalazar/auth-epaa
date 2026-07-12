export interface CustomerSQLResult {
  customer_user_id: string;
  client_id: string;
  email: string;
  password_hash?: string | null;
  auth_method: string;
  auth_provider?: string | null;
  customer_status_id: number;
  failed_attempts: number;
  is_locked_out: boolean;
  two_factor_enabled: boolean;
  email_verified: boolean;
  telefono_verified: boolean;
  created_at: Date;
  updated_at: Date;
  created_by?: string | null;
  updated_by?: string | null;
  deleted_at?: Date | null;
}

import { UUID } from 'crypto';

export interface UserProfileSQLResult {
  // Client Data
  user_id: UUID;
  client_id: string;
  email: string;
  register_date: Date;
  company: CompanySQLResult | null;
  person: ClientSQLResult | null;
}
export interface ClientSQLResult {
  address: string;
  country: string;
  gender_id: number;
  last_name: string;
  parish_id: string;
  person_id: string;
  birth_date: string;
  first_name: string;
  is_deceased: boolean;
  profession_id: number;
  civil_status_id: number;
  phones: PhoneSQLResult[];
  emails: EmailSQLResult[];
}

export interface CompanySQLResult {
  ruc: string;
  address: string;
  country: string;
  client_id: string;
  parish_id: string;
  company_id: number;
  business_name: string;
  commercial_name: string;
  phones: PhoneSQLResult[];
  emails: EmailSQLResult[];
}

export interface PhoneSQLResult {
  telefono_id: number;
  numero: string;
}

export interface EmailSQLResult {
  correo_electronico_id: number;
  correo: string;
}
