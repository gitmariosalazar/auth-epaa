export class UpdateCategoryRequest {
  categoryName?: string;
  categoryDescription?: string;
  isActive?: boolean;

  constructor(
    categoryName?: string,
    isActive?: boolean,
    categoryDescription?: string,
  ) {
    this.categoryName = categoryName;
    this.isActive = isActive;
    this.categoryDescription = categoryDescription;
  }
}
