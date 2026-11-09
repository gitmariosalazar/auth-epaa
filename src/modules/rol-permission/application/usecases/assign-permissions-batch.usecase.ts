import { Inject, Injectable } from '@nestjs/common';
import { InterfaceRolPermissionRepository } from '../../domain/contracts/rol-permission.interface.repository';
import { AssignPermissionsBatchRequest } from '../../domain/schemas/dto/request/assign-permissions-batch.request';
import { RolPermissionDomainException } from '../../domain/exceptions/rol-permission.exceptions';

@Injectable()
export class AssignPermissionsBatchUseCase {
  constructor(
    @Inject('RolPermissionRepository')
    private readonly rolPermissionRepository: InterfaceRolPermissionRepository,
  ) {}

  async execute(request: AssignPermissionsBatchRequest): Promise<boolean> {
    const rolId =
      typeof request?.getRolId === 'function'
        ? request.getRolId()
        : request?.rolId;

    const permissionIds =
      typeof request?.getPermissionIds === 'function'
        ? request.getPermissionIds()
        : request?.permissionIds;

    if (!rolId || isNaN(Number(rolId)) || Number(rolId) <= 0) {
      throw new RolPermissionDomainException('Invalid rolId');
    }

    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
      throw new RolPermissionDomainException(
        'permissionIds must be a non-empty array of numbers',
      );
    }

    const validIds = permissionIds
      .map((id) => Number(id))
      .filter((id) => !isNaN(id) && id > 0);

    if (validIds.length === 0) {
      throw new RolPermissionDomainException(
        'permissionIds must contain valid permission identifiers',
      );
    }

    return await this.rolPermissionRepository.assignPermissionsBatch(
      Number(rolId),
      validIds,
    );
  }
}
