import { Inject, Injectable } from '@nestjs/common';
import { InterfaceRolPermissionRepository } from '../../domain/contracts/rol-permission.interface.repository';
import {
  RolPermissionDomainException,
  RolPermissionNotFoundException,
} from '../../domain/exceptions/rol-permission.exceptions';

@Injectable()
export class DeleteRolPermissionUseCase {
  constructor(
    @Inject('RolPermissionRepository')
    private readonly rolPermissionRepository: InterfaceRolPermissionRepository,
  ) {}

  async execute(rolPermissionId: number): Promise<boolean> {
    if (isNaN(rolPermissionId) || rolPermissionId <= 0) {
      throw new RolPermissionDomainException('Invalid rolPermissionId');
    }

    const existingRolPermission =
      await this.rolPermissionRepository.getRolPermissionById(rolPermissionId);

    if (!existingRolPermission) {
      throw new RolPermissionNotFoundException(rolPermissionId.toString());
    }

    const deleted =
      await this.rolPermissionRepository.deleteRolPermission(rolPermissionId);

    if (!deleted) {
      throw new RolPermissionDomainException('Failed to delete rol permission');
    }

    return true;
  }
}
