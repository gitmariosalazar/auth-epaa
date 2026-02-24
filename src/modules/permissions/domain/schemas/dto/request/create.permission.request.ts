export class CreatePermissionRequest {
  permissionName: string;
  permissionDescription: string;
  isActive: boolean;
  categoryId: number;
  scoppes?: string;

  constructor(
    permissionName: string,
    permissionDescription: string,
    isActive: boolean,
    categoryId: number,
    scoppes?: string,
  ) {
    this.permissionName = permissionName;
    this.permissionDescription = permissionDescription;
    this.isActive = isActive;
    this.categoryId = categoryId;
    this.scoppes = scoppes;
  }
}
