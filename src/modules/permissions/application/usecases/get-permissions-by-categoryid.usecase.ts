import { Inject, Injectable } from '@nestjs/common';
import { InterfacePermissionRepository } from '../../domain/contracts/permission.interface.repository';
import { CategoryResponseWithPermissions } from '../../domain/schemas/dto/response/permission.response';
import { CategoryWithPermissionsNotFoundException } from '../../domain/exceptions/permission.exceptions';

@Injectable()
export class GetPermissionsByCategoryIdUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: InterfacePermissionRepository,
  ) {}

  async getPermissionsByCategory(
    categoryId: number,
  ): Promise<CategoryResponseWithPermissions | null> {
    if (isNaN(categoryId) || categoryId <= 0) {
      throw new Error('Category ID must be a positive number');
    }
    const permissions: CategoryResponseWithPermissions | null =
      await this.permissionRepository.getPermissionsByCategoryId(categoryId);
    if (!permissions) {
      throw new CategoryWithPermissionsNotFoundException(categoryId);
    }
    return permissions;
  }
}
