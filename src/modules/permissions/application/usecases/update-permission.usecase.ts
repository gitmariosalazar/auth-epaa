import { Inject, Injectable } from '@nestjs/common';
import { InterfacePermissionRepository } from '../../domain/contracts/permission.interface.repository';
import { PermissionResponse } from '../../domain/schemas/dto/response/permission.response';
import {
  PermissionAlreadyExistsException,
  PermissionDomainException,
  PermissionNotFoundException,
} from '../../domain/exceptions/permission.exceptions';
import { UpdatePermissionRequest } from '../../domain/schemas/dto/request/update.permission.request';
import { PermissionMapper } from '../mappers/permission.mapper';
import { PermissionModel } from '../../domain/schemas/models/permission.model';

@Injectable()
export class UpdatePermissionUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: InterfacePermissionRepository,
  ) {}

  async execute(
    permissionId: number,
    request: UpdatePermissionRequest,
  ): Promise<PermissionResponse> {
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

    if (
      request.permissionName &&
      request.permissionName !== existingPermission.permissionName
    ) {
      const exists =
        await this.permissionRepository.verifyPermissionExistsByName(
          request.permissionName,
        );
      if (exists) {
        throw new PermissionAlreadyExistsException(request.permissionName);
      }
    }

    const existingPermissionModel =
      PermissionMapper.fromPermissionResponseToPermissionModel(
        existingPermission,
      );

    const permissionModel: PermissionModel =
      PermissionMapper.fromUpdatePermissionRequestToPermissionModel(
        permissionId,
        request,
        existingPermissionModel,
      );

    const updatedPermission = await this.permissionRepository.updatePermission(
      permissionId,
      permissionModel,
    );

    if (!updatedPermission) {
      throw new PermissionDomainException('Failed to update permission');
    }

    return updatedPermission;
  }
}
