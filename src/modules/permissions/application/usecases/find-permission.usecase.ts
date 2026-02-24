import { Inject, Injectable } from '@nestjs/common';
import { InterfacePermissionRepository } from '../../domain/contracts/permission.interface.repository';
import { PermissionResponse } from '../../domain/schemas/dto/response/permission.response';
import {
  PermissionDomainException,
  PermissionNotFoundException,
} from '../../domain/exceptions/permission.exceptions';

@Injectable()
export class FindPermissionUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: InterfacePermissionRepository,
  ) {}

  async findById(permissionId: number): Promise<PermissionResponse> {
    if (isNaN(permissionId) || permissionId <= 0) {
      throw new PermissionDomainException(
        'Permission ID must be a positive number',
      );
    }
    const permission =
      await this.permissionRepository.getPermissionById(permissionId);
    if (!permission) {
      throw new PermissionNotFoundException(permissionId.toString());
    }
    return permission;
  }

  async getAll(): Promise<PermissionResponse[]> {
    const permissions = await this.permissionRepository.getAllPermissions();
    // Returning array, empty or populated.
    return permissions;
  }

  async verifyExistsByName(permissionName: string): Promise<boolean> {
    if (!permissionName || permissionName.trim() === '') {
      throw new PermissionDomainException('Permission name must be provided');
    }
    return await this.permissionRepository.verifyPermissionExistsByName(
      permissionName,
    );
  }
}
