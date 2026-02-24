export class CategoryModel {
  private categoryId: number;
  private categoryName: string;
  private categoryDescription?: string;
  private isActive: boolean;

  constructor(
    categoryId: number,
    categoryName: string,
    isActive: boolean,
    categoryDescription?: string,
  ) {
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.categoryDescription = categoryDescription;
    this.isActive = isActive;
  }

  getId(): number {
    return this.categoryId;
  }

  getName(): string {
    return this.categoryName;
  }

  getDescription(): string | undefined {
    return this.categoryDescription;
  }

  getActiveStatus(): boolean {
    return this.isActive;
  }

  public setName(name: string): void {
    this.categoryName = name;
  }

  public setDescription(description: string): void {
    this.categoryDescription = description;
  }

  public setActiveStatus(isActive: boolean): void {
    this.isActive = isActive;
  }

  public setId(categoryId: number): void {
    this.categoryId = categoryId;
  }

  public toJSON() {
    return {
      categoryId: this.categoryId,
      categoryName: this.categoryName,
      categoryDescription: this.categoryDescription,
      isActive: this.isActive,
    };
  }
}
