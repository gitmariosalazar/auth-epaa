import { Inject, Injectable } from '@nestjs/common';
import { PositionRepository } from '../../domain/contracts/position.interface.repository';
import { PositionResponse } from '../../domain/schemas/dto/response/rol.response';
import {
  PositionDomainException,
  PositionNotFoundException,
} from '../../domain/exceptions/position.exception';

@Injectable()
export class FindPositionUseCase {
  constructor(
    @Inject('PositionRepository')
    private readonly positionRepository: PositionRepository,
  ) {}

  async findById(positionId: number): Promise<PositionResponse> {
    if (isNaN(positionId) || positionId <= 0) {
      throw new PositionDomainException('Invalid position ID');
    }
    const position = await this.positionRepository.getPositionById(positionId);
    if (!position) {
      throw new PositionNotFoundException(positionId.toString());
    }
    return position;
  }

  async findAll(): Promise<PositionResponse[]> {
    return await this.positionRepository.getAllPositions();
  }

  async findByName(name: string): Promise<PositionResponse> {
    if (!name) throw new PositionDomainException('Name is required');
    const position = await this.positionRepository.findByName(name);
    if (!position) throw new PositionNotFoundException(name);
    return position;
  }
}
