export class PermissionModel {
  private permissionId: number;
  private permissionName: string;
  private permissionDescription: string;
  private scoppes?: string;
  private isActive: boolean;
  private categoryId: number;

  constructor(
    permissionId: number,
    permissionName: string,
    permissionDescription: string,
    isActive: boolean,
    categoryId: number,
    scoppes?: string,
  ) {
    this.permissionId = permissionId;
    this.permissionName = permissionName;
    this.permissionDescription = permissionDescription;
    this.isActive = isActive;
    this.categoryId = categoryId;
    this.scoppes = scoppes;
  }

  getId(): number {
    return this.permissionId;
  }

  getName(): string {
    return this.permissionName;
  }

  getDescription(): string {
    return this.permissionDescription;
  }

  getScoppes(): string | undefined {
    return this.scoppes;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCategoryId(): number {
    return this.categoryId;
  }

  public setName(name: string): void {
    this.permissionName = name;
  }

  public setDescription(description: string): void {
    this.permissionDescription = description;
  }

  public setScoppes(scoppes: string): void {
    this.scoppes = scoppes;
  }

  public setIsActive(isActive: boolean): void {
    this.isActive = isActive;
  }

  public setCategoryId(categoryId: number): void {
    this.categoryId = categoryId;
  }

  public setId(permissionId: number): void {
    this.permissionId = permissionId;
  }

  public toJSON() {
    return {
      permissionId: this.permissionId,
      permissionName: this.permissionName,
      permissionDescription: this.permissionDescription,
      scoppes: this.scoppes,
      isActive: this.isActive,
      categoryId: this.categoryId,
    };
  }
}
