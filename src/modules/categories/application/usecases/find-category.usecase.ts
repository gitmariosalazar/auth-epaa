import { Inject, Injectable } from '@nestjs/common';
import { InterfaceCategoryRepository } from '../../domain/contracts/category.interface.repository';
import { CategoryResponse } from '../../domain/schemas/dto/response/category.response';
import { CategoryMapper } from '../mappers/category.mapper';
import {
  CategoryDomainException,
  CategoryNotFoundException,
} from '../../domain/exceptions/category.exceptions';

@Injectable()
export class FindCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: InterfaceCategoryRepository,
  ) {}

  async findById(id: number): Promise<CategoryResponse> {
    if (!id) throw new CategoryDomainException('Category ID is required');
    const category = await this.categoryRepository.getCategoryById(id);
    if (!category) {
      throw new CategoryNotFoundException(id.toString());
    }
    return category;
  }

  async findAll(
    limit: number = 10,
    offset: number = 0,
  ): Promise<CategoryResponse[]> {
    const categories = await this.categoryRepository.getAllCategories(
      limit,
      offset,
    );
    return categories;
  }

  async searchByName(name: string): Promise<CategoryResponse[]> {
    if (!name) throw new CategoryDomainException('Search term is required');
    const categories = await this.categoryRepository.searchCategoryByName(name);
    return categories;
  }

  async verifyExistsByName(name: string): Promise<boolean> {
    if (!name) throw new CategoryDomainException('Category name is required');
    return await this.categoryRepository.verifyCategoryExistsByName(name);
  }
}
