import { Inject, Injectable } from '@nestjs/common';
import { PositionRepository } from '../../domain/contracts/position.interface.repository';
import { CreatePositionRequest } from '../../domain/schemas/dto/request/create-position.request';
import { PositionResponse } from '../../domain/schemas/dto/response/rol.response';
import {
  PositionAlreadyExistsException,
  PositionDomainException,
} from '../../domain/exceptions/position.exception';
import { PositionMapper } from '../mappers/position.mapper';
import { validateFields } from '../../../../shared/validators/fields.validators';

@Injectable()
export class CreatePositionUseCase {
  constructor(
    @Inject('PositionRepository')
    private readonly positionRepository: PositionRepository,
  ) {}

  async execute(request: CreatePositionRequest): Promise<PositionResponse> {
    const requiredFields = ['name', 'levelJerarchy'];
    const missingFieldsMessages = validateFields(request, requiredFields);

    if (missingFieldsMessages.length > 0) {
      throw new PositionDomainException(missingFieldsMessages.join(', '));
    }

    const exists = await this.positionRepository.existsByName(request.name);
    if (exists) {
      throw new PositionAlreadyExistsException(request.name);
    }

    const positionModel =
      PositionMapper.fromCreateRequestToPositionModel(request);

    const created = await this.positionRepository.createPosition(positionModel);
    if (!created) {
      throw new PositionDomainException('Failed to create position');
    }

    return created;
  }
}
