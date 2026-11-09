export class AssignPermissionsBatchRequest {
  public rolId: number;
  public permissionIds: number[];

  constructor(rolId: number, permissionIds: number[]) {
    this.rolId = rolId;
    this.permissionIds = permissionIds;
  }

  public getRolId(): number {
    return this.rolId;
  }

  public getPermissionIds(): number[] {
    return this.permissionIds;
  }
}
