export class RolPermissionModel {
  private rolPermissionId: number;
  private rolId: number;
  private permissionId: number;

  constructor(rolPermissionId: number, rolId: number, permissionId: number) {
    this.rolPermissionId = rolPermissionId;
    this.rolId = rolId;
    this.permissionId = permissionId;
  }

  public getRolPermissionId(): number {
    return this.rolPermissionId;
  }

  public getRolId(): number {
    return this.rolId;
  }

  public getPermissionId(): number {
    return this.permissionId;
  }

  public setRolId(rolId: number): void {
    this.rolId = rolId;
  }

  public setPermissionId(permissionId: number): void {
    this.permissionId = permissionId;
  }
}
