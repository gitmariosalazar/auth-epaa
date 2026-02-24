import { Inject, Injectable } from '@nestjs/common';
import { InterfaceCategoryRepository } from '../../domain/contracts/category.interface.repository';
import {
  CategoryDomainException,
  CategoryNotFoundException,
} from '../../domain/exceptions/category.exceptions';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: InterfaceCategoryRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    if (!id) throw new CategoryDomainException('Category ID is required');
    const existingCategory = await this.categoryRepository.getCategoryById(id);
    if (!existingCategory) {
      throw new CategoryNotFoundException(id.toString());
    }
    return await this.categoryRepository.deleteCategory(id);
  }
}
