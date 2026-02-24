export interface PermissionResponse {
  permissionId: number;
  permissionName: string;
  permissionDescription: string;
  isActive: boolean;
  categoryId: number;
  scoppes?: string;
}

export interface CategoryResponseWithPermissions {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  categoryIsActive: boolean;
  scopes?: string;
  permissions: PermissionResponse[];
}
