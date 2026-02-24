export interface AuthSQLResult {
  user_id: string;
  username: string;
  email: string;
  roles: string[];
  first_name: string;
  last_name: string;
  is_active: boolean;
}
