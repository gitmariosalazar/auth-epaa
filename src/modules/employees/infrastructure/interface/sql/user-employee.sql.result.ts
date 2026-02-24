export interface UserEmployeeSQLResult {
  employee_id: string;
  user_id: string;
  citizen_id: string | null;
  id_card: string | null;
  first_name: string;
  last_name: string;
  birth_date: Date | null;
  sex_id: number | null;
  position_id: number;
  contract_type_id: number;
  employee_status_id: number;
  hire_date: Date;
  termination_date: Date | null;
  base_salary: number | null;
  supervisor_id: string | null;
  assigned_zones: number[];
  driver_license: string | null;
  has_company_vehicle: boolean;
  internal_phone: string | null;
  internal_email: string | null;
  photo_url: string | null;
  metadata: Record<string, any> | null;
  created_at: Date;
  updated_at: Date;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: Date | null;
}
