export class AssignPermissionToUserRequest {
  public userId: string;
  public permissionId: number;
  public expirationDate?: Date | string | null;

  constructor(
    userId: string,
    permissionId: number,
    expirationDate?: Date | string | null,
  ) {
    this.userId = userId;
    this.permissionId = permissionId;
    this.expirationDate = expirationDate;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getPermissionId(): number {
    return this.permissionId;
  }

  public getExpirationDate(): Date | string | null | undefined {
    return this.expirationDate;
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
