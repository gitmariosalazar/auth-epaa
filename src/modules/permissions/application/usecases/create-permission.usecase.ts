import { Inject, Injectable } from '@nestjs/common';
import { InterfacePermissionRepository } from '../../domain/contracts/permission.interface.repository';
import { CreatePermissionRequest } from '../../domain/schemas/dto/request/create.permission.request';
import { PermissionResponse } from '../../domain/schemas/dto/response/permission.response';
import {
  PermissionAlreadyExistsException,
  PermissionDomainException,
} from '../../domain/exceptions/permission.exceptions';
import { PermissionMapper } from '../mappers/permission.mapper';
import { validateFields } from '../../../../shared/validators/fields.validators';
import { PermissionModel } from '../../domain/schemas/models/permission.model';

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: InterfacePermissionRepository,
  ) {}

  async execute(request: CreatePermissionRequest): Promise<PermissionResponse> {
    const requiredFields = [
      'permissionName',
      'permissionDescription',
      'categoryId',
    ];
    const missingFieldsMessages = validateFields(request, requiredFields);

    if (missingFieldsMessages.length > 0) {
      throw new PermissionDomainException(missingFieldsMessages.join(', '));
    }

    const exists = await this.permissionRepository.verifyPermissionExistsByName(
      request.permissionName,
    );

    if (exists) {
      throw new PermissionAlreadyExistsException(request.permissionName);
    }

    const permissionModel: PermissionModel =
      PermissionMapper.fromCreatePermissionRequestToPermissionModel(request);

    const createdPermission =
      await this.permissionRepository.createPermission(permissionModel);

    if (!createdPermission) {
      throw new PermissionDomainException('Failed to create permission');
    }

    return createdPermission;
  }
}
