import { Inject, Injectable } from '@nestjs/common';
import { InterfaceRolRepository } from '../../domain/contracts/rol.interface.repository';
import { RolResponse } from '../../domain/schemas/dto/response/rol.response';
import {
  RolDomainException,
  RolNotFoundException,
  RolAlreadyExistsException,
} from '../../domain/exceptions/rol.exceptions';
import { UpdateRolRequest } from '../../domain/schemas/dto/request/update.rol.request';
import { RolMapper } from '../mappers/rol.mapper';
import { validateFields } from '../../../../shared/validators/fields.validators';
import { RolModel } from '../../domain/schemas/models/rol.model';

@Injectable()
export class UpdateRolUseCase {
  constructor(
    @Inject('RolRepository')
    private readonly rolRepository: InterfaceRolRepository,
  ) {}

  async updateRol(
    rolId: number,
    updateRolRequest: UpdateRolRequest,
  ): Promise<RolResponse> {
    if (isNaN(rolId) || rolId <= 0) {
      throw new RolDomainException('Invalid rol ID');
    }

    const existingRolResponse = await this.rolRepository.getRolById(rolId);
    if (!existingRolResponse) {
      throw new RolNotFoundException(rolId.toString());
    }

    const requiredFields = ['name'];
    const missingFieldsMessages = validateFields(
      updateRolRequest,
      requiredFields,
    );

    if (missingFieldsMessages.length > 0) {
      throw new RolDomainException(missingFieldsMessages.join(', '));
    }

    // Check unique name if changing name
    if (
      updateRolRequest.name &&
      updateRolRequest.name !== existingRolResponse.name
    ) {
      const exists = await this.rolRepository.existsByName(
        updateRolRequest.name,
      );
      if (exists) {
        throw new RolAlreadyExistsException(updateRolRequest.name);
      }
    }

    const existingRolModel =
      RolMapper.fromResponseToRolModel(existingRolResponse);
    const rolModel: RolModel = RolMapper.fromUpdateRolRequestToRolModel(
      updateRolRequest,
      existingRolModel,
    );

    const updatedRol = await this.rolRepository.updateRol(rolId, rolModel);
    if (!updatedRol) {
      throw new RolDomainException('Failed to update rol');
    }

    return updatedRol;
  }
}
