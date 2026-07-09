import { Inject, Injectable } from '@nestjs/common';
import { PositionRepository } from '../../domain/contracts/position.interface.repository';
import { PositionResponse } from '../../domain/schemas/dto/response/rol.response';
import {
  PositionAlreadyExistsException,
  PositionDomainException,
  PositionNotFoundException,
} from '../../domain/exceptions/position.exception';
import { UpdatePositionRequest } from '../../domain/schemas/dto/request/update-position.request';
import { PositionMapper } from '../mappers/position.mapper';

@Injectable()
export class UpdatePositionUseCase {
  constructor(
    @Inject('PositionRepository')
    private readonly positionRepository: PositionRepository,
  ) {}

  async updatePosition(
    positionId: number,
    request: UpdatePositionRequest,
  ): Promise<PositionResponse> {
    if (isNaN(positionId) || positionId <= 0) {
      throw new PositionDomainException('Invalid position ID');
    }

    const existingResponse =
      await this.positionRepository.getPositionById(positionId);
    if (!existingResponse) {
      throw new PositionNotFoundException(positionId.toString());
    }

    if (request.name && request.name !== existingResponse.name) {
      const nameExists = await this.positionRepository.existsByName(
        request.name,
      );
      if (nameExists) {
        throw new PositionAlreadyExistsException(request.name);
      }
    }

    const existingModel =
      PositionMapper.fromResponseToPositionModel(existingResponse);
    const updatedModel = PositionMapper.fromUpdateRequestToPositionModel(
      request,
      existingModel,
    );

    const updated = await this.positionRepository.updatePosition(
      positionId,
      updatedModel,
    );
    if (!updated) {
      throw new PositionDomainException('Failed to update position');
    }

    return updated;
  }
}
