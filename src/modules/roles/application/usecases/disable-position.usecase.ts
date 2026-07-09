import { Inject, Injectable } from '@nestjs/common';
import { PositionRepository } from '../../domain/contracts/position.interface.repository';
import {
  PositionDomainException,
  PositionNotFoundException,
} from '../../domain/exceptions/position.exception';

@Injectable()
export class DisablePositionUseCase {
  constructor(
    @Inject('PositionRepository')
    private readonly positionRepository: PositionRepository,
  ) {}

  async execute(positionId: number): Promise<boolean> {
    if (isNaN(positionId) || positionId <= 0) {
      throw new PositionDomainException('Invalid position ID');
    }

    const existing = await this.positionRepository.getPositionById(positionId);
    if (!existing) {
      throw new PositionNotFoundException(positionId.toString());
    }

    const result = await this.positionRepository.disablePosition(positionId);
    if (!result) {
      throw new PositionDomainException('Failed to disable position');
    }

    return result;
  }
}
