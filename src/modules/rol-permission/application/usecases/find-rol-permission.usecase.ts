import { Inject, Injectable } from '@nestjs/common';
import { InterfaceRolPermissionRepository } from '../../domain/contracts/rol-permission.interface.repository';
import { RolPermissionResponse } from '../../domain/schemas/dto/response/rol-permission.response';
import {
  RolPermissionDomainException,
  RolPermissionNotFoundException,
} from '../../domain/exceptions/rol-permission.exceptions';

@Injectable()
export class FindRolPermissionUseCase {
  constructor(
    @Inject('RolPermissionRepository')
    private readonly rolPermissionRepository: InterfaceRolPermissionRepository,
  ) {}

  async findById(rolPermissionId: number): Promise<RolPermissionResponse> {
    if (isNaN(rolPermissionId) || rolPermissionId <= 0) {
      throw new RolPermissionDomainException('Invalid rolPermissionId');
    }
    const rolPermission =
      await this.rolPermissionRepository.getRolPermissionById(rolPermissionId);
    if (!rolPermission) {
      throw new RolPermissionNotFoundException(rolPermissionId.toString());
    }
    return rolPermission;
  }

  async findAll(
    limit: number,
    offset: number,
  ): Promise<RolPermissionResponse[]> {
    if (limit <= 0 || offset < 0) {
      throw new RolPermissionDomainException('Invalid limit or offset');
    }
    const rolPermissions =
      await this.rolPermissionRepository.getAllRolPermissions(limit, offset);

    // Consistent with Roles module, returning array, empty if none found (but original service threw 404)
    // I will return array to be cleaner, Controller can decide.
    return rolPermissions;
  }

  async verifyExists(rolId: number, permissionId: number): Promise<boolean> {
    if (!rolId || !permissionId || rolId <= 0 || permissionId <= 0) {
      throw new RolPermissionDomainException('Invalid rolId or permissionId');
    }
    return await this.rolPermissionRepository.verifyRolPermissionExists(
      rolId,
      permissionId,
    );
  }
}
