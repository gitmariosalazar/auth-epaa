export class CreateRolPermissionRequest {
  rolId: number;
  permissionId: number;

  constructor(rolId: number, permissionId: number) {
    this.rolId = rolId;
    this.permissionId = permissionId;
  }
}
