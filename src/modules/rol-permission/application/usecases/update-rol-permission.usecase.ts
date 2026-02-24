import { Inject, Injectable } from '@nestjs/common';
import { InterfaceRolPermissionRepository } from '../../domain/contracts/rol-permission.interface.repository';
import { RolPermissionResponse } from '../../domain/schemas/dto/response/rol-permission.response';
import {
  RolPermissionDomainException,
  RolPermissionNotFoundException,
} from '../../domain/exceptions/rol-permission.exceptions';
import { UpdateRolPermissionRequest } from '../../domain/schemas/dto/request/update.rol-permission.request';
import { RolPermissionMapper } from '../mappers/rol-permission.mapper';
import { validateFields } from '../../../../shared/validators/fields.validators';
import { RolPermissionModel } from '../../domain/schemas/models/rol-permission.model';

@Injectable()
export class UpdateRolPermissionUseCase {
  constructor(
    @Inject('RolPermissionRepository')
    private readonly rolPermissionRepository: InterfaceRolPermissionRepository,
  ) {}

  async execute(
    rolPermissionId: number,
    request: UpdateRolPermissionRequest,
  ): Promise<RolPermissionResponse> {
    if (isNaN(rolPermissionId) || rolPermissionId <= 0) {
      throw new RolPermissionDomainException('Invalid rolPermissionId');
    }

    const requiredFields = ['rolId', 'permissionId'];
    const missingFieldsMessages = validateFields(request, requiredFields);
    if (missingFieldsMessages.length > 0) {
      throw new RolPermissionDomainException(missingFieldsMessages.join(', '));
    }

    const existingRolPermission =
      await this.rolPermissionRepository.getRolPermissionById(rolPermissionId);

    if (!existingRolPermission) {
      throw new RolPermissionNotFoundException(rolPermissionId.toString());
    }

    const rolPermissionModel: RolPermissionModel =
      RolPermissionMapper.fromUpdateRolPermissionRequestToRolPermissionModel(
        rolPermissionId,
        request,
        RolPermissionMapper.fromRolPermissionResponseToRolPermissionModel(
          existingRolPermission,
        ),
      );

    const updatedRolPermission =
      await this.rolPermissionRepository.updateRolPermission(
        rolPermissionId,
        rolPermissionModel,
      );

    if (!updatedRolPermission) {
      throw new RolPermissionDomainException('Failed to update rol permission');
    }

    return updatedRolPermission;
  }
}
