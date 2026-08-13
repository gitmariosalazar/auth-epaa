export interface AuthSQLResult {
  user_id: string;
  username: string;
  email: string;
  roles: {
    id: number;
    name: string;
    description: string;
  }[];
  first_name: string;
  last_name: string;
  is_active: boolean | null | number;
  card_id?: string;
  is_natural_person?: boolean | null | number;
}
