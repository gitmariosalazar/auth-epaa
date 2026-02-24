export class AssignRoleToUserRequest {
  public userId: string;
  public roleId: number;

  constructor(userId: string, roleId: number) {
    this.userId = userId;
    this.roleId = roleId;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getRoleId(): number {
    return this.roleId;
  }
}

export class RemoveRoleFromUserRequest {
  public userId: string;
  public roleId: number;

  constructor(userId: string, roleId: number) {
    this.userId = userId;
    this.roleId = roleId;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getRoleId(): number {
    return this.roleId;
  }
}
