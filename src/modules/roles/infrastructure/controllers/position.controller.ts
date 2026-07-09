import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreatePositionRequest } from '../../domain/schemas/dto/request/create-position.request';
import { UpdatePositionRequest } from '../../domain/schemas/dto/request/update-position.request';
import { CreatePositionUseCase } from '../../application/usecases/create-position.usecase';
import { FindPositionUseCase } from '../../application/usecases/find-position.usecase';
import { UpdatePositionUseCase } from '../../application/usecases/update-position.usecase';
import { DisablePositionUseCase } from '../../application/usecases/disable-position.usecase';
import { PositionDomainException } from '../../domain/exceptions/position.exception';
import { statusCode } from '../../../../settings/environments/status-code';

@Controller('position')
export class PositionController {
  constructor(
    private readonly createPositionUseCase: CreatePositionUseCase,
    private readonly findPositionUseCase: FindPositionUseCase,
    private readonly updatePositionUseCase: UpdatePositionUseCase,
    private readonly disablePositionUseCase: DisablePositionUseCase,
  ) {}

  private handleException(error: any): never {
    if (error instanceof PositionDomainException) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: error.message,
      });
    }
    if (error instanceof RpcException) throw error;

    throw new RpcException({
      statusCode: statusCode.INTERNAL_SERVER_ERROR,
      message: error.message || 'Internal server error',
    });
  }

  @MessagePattern('authentication.positions.get_position_by_id')
  async getPositionById(@Payload() positionId: number) {
    try {
      return await this.findPositionUseCase.findById(positionId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.positions.get_all_positions')
  async getAllPositions() {
    try {
      return await this.findPositionUseCase.findAll();
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.positions.create_position')
  async createPosition(@Payload() positionData: CreatePositionRequest) {
    try {
      return await this.createPositionUseCase.execute(positionData);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.positions.update_position')
  async updatePosition(
    @Payload()
    payload: {
      positionId: number;
      positionData: UpdatePositionRequest;
    },
  ) {
    try {
      const { positionId, positionData } = payload;
      return await this.updatePositionUseCase.updatePosition(
        positionId,
        positionData,
      );
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.positions.disable_position')
  async disablePosition(@Payload() positionId: number) {
    try {
      return await this.disablePositionUseCase.execute(positionId);
    } catch (error) {
      this.handleException(error);
    }
  }
}
