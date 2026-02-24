import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateCategoryRequest } from '../../domain/schemas/dto/request/create.category.request';
import { UpdateCategoryRequest } from '../../domain/schemas/dto/request/update.category.request';
import { CreateCategoryUseCase } from '../../application/usecases/create-category.usecase';
import { FindCategoryUseCase } from '../../application/usecases/find-category.usecase';
import { UpdateCategoryUseCase } from '../../application/usecases/update-category.usecase';
import { DeleteCategoryUseCase } from '../../application/usecases/delete-category.usecase';
import { CategoryDomainException } from '../../domain/exceptions/category.exceptions';
import { statusCode } from '../../../../settings/environments/status-code';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly findCategoryUseCase: FindCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  private handleException(error: any): never {
    if (error instanceof CategoryDomainException) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: error.message,
      });
    }
    if (error instanceof RpcException) throw error;

    throw new RpcException({
      statusCode: statusCode.INTERNAL_SERVER_ERROR,
      message: error.message || 'Internal server error',
    });
  }

  @MessagePattern('authentication.categories.create_category')
  async createCategory(@Payload() categoryData: CreateCategoryRequest) {
    try {
      return await this.createCategoryUseCase.execute(categoryData);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.categories.get_category_by_id')
  async getCategoryById(@Payload() categoryId: number) {
    try {
      return await this.findCategoryUseCase.findById(categoryId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.categories.get_all_categories')
  async getAllCategories(
    @Payload() paginationData: { limit: number; offset: number },
  ) {
    try {
      const { limit, offset } = paginationData || { limit: 10, offset: 0 };
      return await this.findCategoryUseCase.findAll(limit, offset);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.categories.update_category')
  async updateCategory(
    @Payload()
    updateData: {
      categoryId: number;
      categoryDetails: UpdateCategoryRequest;
    },
  ) {
    try {
      return await this.updateCategoryUseCase.execute(
        updateData.categoryId,
        updateData.categoryDetails,
      );
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.categories.delete_category')
  async deleteCategory(@Payload() categoryId: number) {
    try {
      return await this.deleteCategoryUseCase.execute(categoryId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.categories.verify_category_existence')
  async verifyCategoryExistence(@Payload() categoryName: string) {
    try {
      return await this.findCategoryUseCase.verifyExistsByName(categoryName);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.categories.search_category_by_name')
  async searchCategoryByName(@Payload() categoryName: string) {
    try {
      return await this.findCategoryUseCase.searchByName(categoryName);
    } catch (error) {
      this.handleException(error);
    }
  }
}
