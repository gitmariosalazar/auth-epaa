import { Inject, Injectable } from '@nestjs/common';
import { InterfacePermissionRepository } from '../../domain/contracts/permission.interface.repository';
import { CategoryResponseWithPermissions } from '../../domain/schemas/dto/response/permission.response';

@Injectable()
export class GetPermissionsWithCategoryUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: InterfacePermissionRepository,
  ) {}

  async getPermissionsWithCategory(): Promise<
    CategoryResponseWithPermissions[]
  > {
    const permissions: CategoryResponseWithPermissions[] =
      await this.permissionRepository.getPermissionsWithCategory();
    return permissions;
  }
}
