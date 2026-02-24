export interface PermissionSQLResponse {
  permission_id: number;
  permission_name: string;
  permission_description: string;
  scoppes: string;
  is_active: boolean;
  category_id: number;
}

export interface CategorySqlResponseWithPermissions {
  category_id: number;
  category_name: string;
  category_description: string;
  category_is_active: boolean;
  scopes: string;
  permissions: PermissionSQLResponse[];
}
