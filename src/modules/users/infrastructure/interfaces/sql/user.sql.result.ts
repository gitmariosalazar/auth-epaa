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
  two_factor_enabled?: boolean;
  is_active: boolean;
  observations?: string | null;
}

export interface UserWithRolesAndPermissionsSQLResult extends UserSQLResult {
  password_hash?: string;
  roles: string[]; // Comma-separated roles
  permissions: string[]; // Comma-separated permissions
}

export interface UserWithPermissionsSQLResult extends UserSQLResult {
  permissions: string[]; // Comma-separated permissions
}

export interface UserWithRolesSQLResult extends UserSQLResult {
  roles: string[]; // Comma-separated roles
}
