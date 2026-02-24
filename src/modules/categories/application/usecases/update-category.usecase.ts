import { Inject, Injectable } from '@nestjs/common';
import { InterfaceCategoryRepository } from '../../domain/contracts/category.interface.repository';
import { UpdateCategoryRequest } from '../../domain/schemas/dto/request/update.category.request';
import { CategoryResponse } from '../../domain/schemas/dto/response/category.response';
import { CategoryMapper } from '../mappers/category.mapper';
import {
  CategoryDomainException,
  CategoryNotFoundException,
} from '../../domain/exceptions/category.exceptions';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: InterfaceCategoryRepository,
  ) {}

  async execute(
    id: number,
    request: UpdateCategoryRequest,
  ): Promise<CategoryResponse> {
    if (!id) throw new CategoryDomainException('Category ID is required');
    const existingCategoryResponse =
      await this.categoryRepository.getCategoryById(id);
    if (!existingCategoryResponse) {
      throw new CategoryNotFoundException(id.toString());
    }

    const existingCategoryModel =
      CategoryMapper.fromCategoryResponseToCategoryModel(
        existingCategoryResponse,
      );

    const updatedModel =
      CategoryMapper.fromUpdateCategoryRequestToCategoryModel(
        id,
        request,
        existingCategoryModel,
      );

    const updatedCategory = await this.categoryRepository.updateCategory(
      id,
      updatedModel,
    );
    if (!updatedCategory) {
      throw new CategoryDomainException('Failed to update category');
    }
    return updatedCategory;
  }
}
