import { CategoryResponse } from '../schemas/dto/response/category.response';
import { CategoryModel } from '../schemas/models/category.model';

export interface InterfaceCategoryRepository {
  createCategory(category: CategoryModel): Promise<CategoryResponse | null>;
  getCategoryById(categoryId: number): Promise<CategoryResponse | null>;
  getAllCategories(limit: number, offset: number): Promise<CategoryResponse[]>;
  updateCategory(
    categoryId: number,
    category: CategoryModel,
  ): Promise<CategoryResponse | null>;
  deleteCategory(categoryId: number): Promise<boolean>;
  verifyCategoryExistsByName(categoryName: string): Promise<boolean>;
  searchCategoryByName(term: string): Promise<CategoryResponse[]>;
}
