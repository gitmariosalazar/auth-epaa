import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateRolRequest } from '../../domain/schemas/dto/request/create.rol.request';
import { UpdateRolRequest } from '../../domain/schemas/dto/request/update.rol.request';
import { CreateRolUseCase } from '../../application/usecases/create-rol.usecase';
import { FindRolUseCase } from '../../application/usecases/find-rol.usecase';
import { UpdateRolUseCase } from '../../application/usecases/update-rol.usecase';
import { RolDomainException } from '../../domain/exceptions/rol.exceptions';
import { statusCode } from '../../../../settings/environments/status-code';

@Controller('rol')
export class RolController {
  constructor(
    private readonly createRolUseCase: CreateRolUseCase,
    private readonly findRolUseCase: FindRolUseCase,
    private readonly updateRolUseCase: UpdateRolUseCase,
  ) {}

  private handleException(error: any): never {
    if (error instanceof RolDomainException) {
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

  @MessagePattern('authentication.roles.get_rol_by_id')
  async getRolById(@Payload() rolId: number) {
    try {
      return await this.findRolUseCase.findById(rolId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.roles.get_all_rols')
  async getAllRols(@Payload() payload: { limit: number; offset: number }) {
    try {
      const { limit, offset } = payload;
      return await this.findRolUseCase.findAll(limit, offset);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.roles.create_rol')
  async createRol(@Payload() rolData: CreateRolRequest) {
    try {
      return await this.createRolUseCase.execute(rolData);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.roles.update_rol')
  async updateRol(
    @Payload() payload: { rolId: number; rolData: UpdateRolRequest },
  ) {
    try {
      const { rolId, rolData } = payload;
      return await this.updateRolUseCase.updateRol(rolId, rolData);
    } catch (error) {
      this.handleException(error);
    }
  }
}
