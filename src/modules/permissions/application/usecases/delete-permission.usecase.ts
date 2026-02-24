import { Inject, Injectable } from '@nestjs/common';
import { InterfacePermissionRepository } from '../../domain/contracts/permission.interface.repository';
import {
  PermissionDomainException,
  PermissionNotFoundException,
} from '../../domain/exceptions/permission.exceptions';

@Injectable()
export class DeletePermissionUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: InterfacePermissionRepository,
  ) {}

  async execute(permissionId: number): Promise<boolean> {
    if (isNaN(permissionId) || permissionId <= 0) {
      throw new PermissionDomainException(
        'Permission ID must be a positive number',
      );
    }

    const existingPermission =
      await this.permissionRepository.getPermissionById(permissionId);

    if (!existingPermission) {
      throw new PermissionNotFoundException(permissionId.toString());
    }

    const deleted =
      await this.permissionRepository.deletePermission(permissionId);

    if (!deleted) {
      throw new PermissionDomainException('Failed to delete permission');
    }

    return true;
  }
}
