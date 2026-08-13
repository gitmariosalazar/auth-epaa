import { RolOrPermission } from '../../../../../shared/interfaces/RolOrPermission';

export interface UserSQLResult {
  user_id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: Date;
  sex_id?: number;
  card_id?: string;
  citizen_id?: string;
  position_id?: number;
  contract_type_id?: number;
  employee_status_id?: number;
  hire_date?: Date;
  termination_date?: Date;
  base_salary?: number;
  supervisor_id?: string;
  assigned_zones?: number[];
  driver_license?: string;
  has_company_vehicle?: boolean;
  internal_phone?: string;
  internal_email?: string;
  photo_url?: string;
  created_by?: string;
  registered_at: Date;
  last_login?: Date | null;
  failed_attempts?: number;
  two_factor_enabled?: boolean | null | number;
  is_active: boolean | null | number;
  observations?: string | null;
  position_name?: string;
  contract_type_name?: string;
}

export interface UserWithRolesAndPermissionsSQLResult extends UserSQLResult {
  password_hash?: string;
  roles: RolOrPermission[];
  permissions: RolOrPermission[];
}

export interface UserWithPermissionsSQLResult extends UserSQLResult {
  permissions: RolOrPermission[];
}

export interface UserWithRolesSQLResult extends UserSQLResult {
  roles: RolOrPermission[];
}

export interface PhoneSqlResponse {
  telefono_id: number;
  numero: string;
}

export interface EmailSqlResponse {
  correo_electronico_id: number;
  correo: string;
}

export interface ClientSqlResponse {
  address: string;
  country: string;
  gender_id: number;
  last_name: string;
  parish_id: string;
  person_id: string;
  birth_date: string;
  first_name: string;
  is_deceased: boolean | null | number;
  profession_id: number;
  civil_status_id: number;
  phones: PhoneSqlResponse[];
  emails: EmailSqlResponse[];
}

export interface CompanySqlResponse {
  ruc: string;
  address: string;
  country: string;
  client_id: string;
  parish_id: string;
  company_id: number;
  business_name: string;
  commercial_name: string;
  phones: PhoneSqlResponse[];
  emails: EmailSqlResponse[];
}

export interface CustomerWithRolesAndPermissionsSQLResult {
  user_id: string;
  username: string;
  email: string;
  registered_at: Date;
  last_login?: Date | null;
  failed_attempts?: number;
  two_factor_enabled?: boolean | null | number;
  is_active: boolean | null | number;
  observations?: string | null;
  password_hash?: string | null;
  company: CompanySqlResponse | null;
  person: ClientSqlResponse | null;
  roles: RolOrPermission[];
  permissions: RolOrPermission[];
}
