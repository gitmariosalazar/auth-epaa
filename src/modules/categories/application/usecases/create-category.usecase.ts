import { Inject, Injectable } from '@nestjs/common';
import { InterfaceCategoryRepository } from '../../domain/contracts/category.interface.repository';
import { CreateCategoryRequest } from '../../domain/schemas/dto/request/create.category.request';
import { CategoryResponse } from '../../domain/schemas/dto/response/category.response';
import { CategoryMapper } from '../mappers/category.mapper';
import { CategoryAlreadyExistsException } from '../../domain/exceptions/category.exceptions';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: InterfaceCategoryRepository,
  ) {}

  async execute(request: CreateCategoryRequest): Promise<CategoryResponse> {
    const exists = await this.categoryRepository.verifyCategoryExistsByName(
      request.categoryName,
    );
    if (exists) {
      throw new CategoryAlreadyExistsException(request.categoryName);
    }
    const newCategory =
      CategoryMapper.fromCreateCategoryRequestToCategoryModel(request);
    const createdCategory =
      await this.categoryRepository.createCategory(newCategory);
    return createdCategory as CategoryResponse;
  }
}
