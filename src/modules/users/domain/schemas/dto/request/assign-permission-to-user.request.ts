export class AssignPermissionToUserRequest {
  public userId: string;
  public permissionId: number;

  constructor(userId: string, permissionId: number) {
    this.userId = userId;
    this.permissionId = permissionId;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getPermissionId(): number {
    return this.permissionId;
  }
}

export class RemovePermissionFromUserRequest {
  public userId: string;
  public permissionId: number;

  constructor(userId: string, permissionId: number) {
    this.userId = userId;
    this.permissionId = permissionId;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getPermissionId(): number {
    return this.permissionId;
  }
}
