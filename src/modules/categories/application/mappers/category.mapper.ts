import { CreateCategoryRequest } from '../../domain/schemas/dto/request/create.category.request';
import { UpdateCategoryRequest } from '../../domain/schemas/dto/request/update.category.request';
import { CategoryResponse } from '../../domain/schemas/dto/response/category.response';
import { CategoryModel } from '../../domain/schemas/models/category.model';

export class CategoryMapper {
  static fromCategoryModelToCategoryResponse(
    categoryModel: CategoryModel,
  ): CategoryResponse {
    return {
      categoryId: categoryModel.getId(),
      categoryName: categoryModel.getName(),
      categoryDescription: categoryModel.getDescription(),
      isActive: categoryModel.getActiveStatus(),
    };
  }

  static fromCategoryModelsToCategoryResponses(
    categoryModels: CategoryModel[],
  ): CategoryResponse[] {
    return categoryModels.map((categoryModel) =>
      this.fromCategoryModelToCategoryResponse(categoryModel),
    );
  }

  static fromCategoryResponseToCategoryModel(
    categoryResponse: CategoryResponse,
  ): CategoryModel {
    return new CategoryModel(
      categoryResponse.categoryId,
      categoryResponse.categoryName,
      categoryResponse.isActive,
      categoryResponse.categoryDescription,
    );
  }

  static fromCategoryResponsesToCategoryModels(
    categoryResponses: CategoryResponse[],
  ): CategoryModel[] {
    return categoryResponses.map((categoryResponse) =>
      this.fromCategoryResponseToCategoryModel(categoryResponse),
    );
  }

  static fromCreateCategoryRequestToCategoryModel(
    categoryRequest: CreateCategoryRequest,
  ): CategoryModel {
    return new CategoryModel(
      0,
      categoryRequest.categoryName,
      categoryRequest.isActive || true,
      categoryRequest.categoryDescription,
    );
  }

  static fromCreateCategoryRequestsToCategoryModels(
    categoryRequests: CreateCategoryRequest[],
  ): CategoryModel[] {
    return categoryRequests.map((categoryRequest) =>
      this.fromCreateCategoryRequestToCategoryModel(categoryRequest),
    );
  }

  static fromCategoryModelToCreateCategoryRequest(
    categoryModel: CategoryModel,
  ): CreateCategoryRequest {
    return {
      categoryName: categoryModel.getName(),
      isActive: categoryModel.getActiveStatus(),
      categoryDescription: categoryModel.getDescription(),
    };
  }

  static fromCategoryModelsToCreateCategoryRequests(
    categoryModels: CategoryModel[],
  ): CreateCategoryRequest[] {
    return categoryModels.map((categoryModel) =>
      this.fromCategoryModelToCreateCategoryRequest(categoryModel),
    );
  }

  static fromUpdateCategoryRequestToCategoryModel(
    categoryId: number,
    categoryRequest: UpdateCategoryRequest,
    existingCategoryModel: CategoryModel,
  ): CategoryModel {
    const updatedCategoryName =
      categoryRequest.categoryName ?? existingCategoryModel.getName();
    const updatedIsActive =
      categoryRequest.isActive ?? existingCategoryModel.getActiveStatus();
    const updatedCategoryDescription =
      categoryRequest.categoryDescription ??
      existingCategoryModel.getDescription();

    const updatedCategoryModel = new CategoryModel(
      categoryId,
      updatedCategoryName,
      updatedIsActive,
      updatedCategoryDescription,
    );
    return updatedCategoryModel;
  }

  static fromUpdateCategoryRequestsToCategoryModels(
    categoryIds: number[],
    categoryRequests: CreateCategoryRequest[],
    existingCategoryModels: CategoryModel[],
  ): CategoryModel[] {
    return categoryRequests.map((categoryRequest, index) =>
      this.fromUpdateCategoryRequestToCategoryModel(
        categoryIds[index],
        categoryRequest,
        existingCategoryModels[index],
      ),
    );
  }
}
