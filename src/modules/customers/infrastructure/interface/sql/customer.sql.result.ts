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
