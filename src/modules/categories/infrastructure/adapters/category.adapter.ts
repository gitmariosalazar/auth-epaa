import { CategoryResponse } from '../../domain/schemas/dto/response/category.response';
import { CategorySqlResponse } from '../interfaces/sql/category.sql.response';

export class CategoryAdapter {
  static fromCategorySqlResponseToCategoryResponse(
    sqlResponse: CategorySqlResponse,
  ): CategoryResponse {
    return {
      categoryId: sqlResponse.category_id,
      categoryName: sqlResponse.category_name,
      categoryDescription: sqlResponse.category_description ?? undefined,
      isActive: Boolean(sqlResponse.is_active),
    };
  }

  static fromCategorySQLResponseArrayToCategoryResponseArray(
    sqlResponses: CategorySqlResponse[],
  ): CategoryResponse[] {
    return sqlResponses.map((sqlResponse) =>
      this.fromCategorySqlResponseToCategoryResponse(sqlResponse),
    );
  }
}
