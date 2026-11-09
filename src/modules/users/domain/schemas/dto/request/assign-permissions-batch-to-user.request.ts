export interface UserPermissionBatchItem {
  permissionId: number;
  expirationDate?: Date | string | null;
}

export class AssignPermissionsBatchToUserRequest {
  public userId: string;
  public permissions: UserPermissionBatchItem[];

  constructor(userId: string, permissions: UserPermissionBatchItem[]) {
    this.userId = userId;
    this.permissions = permissions;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getPermissions(): UserPermissionBatchItem[] {
    return this.permissions;
  }
}
