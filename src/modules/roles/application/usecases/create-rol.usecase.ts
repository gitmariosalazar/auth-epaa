import { Inject, Injectable } from '@nestjs/common';
import { InterfaceRolRepository } from '../../domain/contracts/rol.interface.repository';
import { CreateRolRequest } from '../../domain/schemas/dto/request/create.rol.request';
import { RolResponse } from '../../domain/schemas/dto/response/rol.response';
import {
  RolAlreadyExistsException,
  RolDomainException,
} from '../../domain/exceptions/rol.exceptions';
import { RolMapper } from '../mappers/rol.mapper';
import { validateFields } from '../../../../shared/validators/fields.validators';
import { RolModel } from '../../domain/schemas/models/rol.model';

@Injectable()
export class CreateRolUseCase {
  constructor(
    @Inject('RolRepository')
    private readonly rolRepository: InterfaceRolRepository,
  ) {}

  async execute(request: CreateRolRequest): Promise<RolResponse> {
    const requiredFields = ['name'];
    const missingFieldsMessages = validateFields(request, requiredFields);

    if (missingFieldsMessages.length > 0) {
      throw new RolDomainException(missingFieldsMessages.join(', '));
    }

    const existsName = await this.rolRepository.existsByName(request.name);
    if (existsName) {
      throw new RolAlreadyExistsException(request.name);
    }

    const rolModel: RolModel =
      RolMapper.fromCreateRolRequestToRolModel(request);

    const createdRol = await this.rolRepository.createRol(rolModel);
    if (!createdRol) {
      throw new RolDomainException('Failed to create rol');
    }

    return createdRol;
  }
}
