export interface RolSQLResponse {
  rol_id: number;
  name: string;
  description?: string;
  parent_rol_id?: number;
  is_active: boolean;
  creation_date: Date;
}
