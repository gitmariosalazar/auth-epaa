import { Inject, Injectable } from '@nestjs/common';
import { InterfaceRolPermissionRepository } from '../../domain/contracts/rol-permission.interface.repository';
import { CreateRolPermissionRequest } from '../../domain/schemas/dto/request/create.rol-permission.request';
import { RolPermissionResponse } from '../../domain/schemas/dto/response/rol-permission.response';
import {
  RolPermissionAlreadyExistsException,
  RolPermissionDomainException,
} from '../../domain/exceptions/rol-permission.exceptions';
import { RolPermissionMapper } from '../mappers/rol-permission.mapper';
import { validateFields } from '../../../../shared/validators/fields.validators';
import { RolPermissionModel } from '../../domain/schemas/models/rol-permission.model';

@Injectable()
export class CreateRolPermissionUseCase {
  constructor(
    @Inject('RolPermissionRepository')
    private readonly rolPermissionRepository: InterfaceRolPermissionRepository,
  ) {}

  async execute(
    request: CreateRolPermissionRequest,
  ): Promise<RolPermissionResponse> {
    const requiredFields = ['rolId', 'permissionId'];
    const missingFieldsMessages = validateFields(request, requiredFields);

    if (missingFieldsMessages.length > 0) {
      throw new RolPermissionDomainException(missingFieldsMessages.join(', '));
    }

    const exists = await this.rolPermissionRepository.verifyRolPermissionExists(
      request.rolId,
      request.permissionId,
    );
    if (exists) {
      throw new RolPermissionAlreadyExistsException(
        `rolId ${request.rolId} and permissionId ${request.permissionId}`,
      );
    }

    const rolPermissionModel: RolPermissionModel =
      RolPermissionMapper.fromCreateRolPermisionRequestToRolPermissionModel(
        request,
      );

    const createdRolPermission =
      await this.rolPermissionRepository.createRolPermission(
        rolPermissionModel,
      );

    if (!createdRolPermission) {
      throw new RolPermissionDomainException('Failed to create rol permission');
    }

    return createdRolPermission;
  }
}
