import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateRolPermissionRequest } from '../../domain/schemas/dto/request/create.rol-permission.request';
import { UpdateRolPermissionRequest } from '../../domain/schemas/dto/request/update.rol-permission.request';
import { CreateRolPermissionUseCase } from '../../application/usecases/create-rol-permission.usecase';
import { FindRolPermissionUseCase } from '../../application/usecases/find-rol-permission.usecase';
import { UpdateRolPermissionUseCase } from '../../application/usecases/update-rol-permission.usecase';
import { DeleteRolPermissionUseCase } from '../../application/usecases/delete-rol-permission.usecase';
import { RolPermissionDomainException } from '../../domain/exceptions/rol-permission.exceptions';
import { statusCode } from '../../../../settings/environments/status-code';

@Controller('rol-permission')
export class RolPermissionController {
  constructor(
    private readonly createRolPermissionUseCase: CreateRolPermissionUseCase,
    private readonly findRolPermissionUseCase: FindRolPermissionUseCase,
    private readonly updateRolPermissionUseCase: UpdateRolPermissionUseCase,
    private readonly deleteRolPermissionUseCase: DeleteRolPermissionUseCase,
  ) {}

  private handleException(error: any): never {
    if (error instanceof RolPermissionDomainException) {
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

  @MessagePattern('authentication.rol_permission.create_rol_permission')
  async createRolPermission(
    @Payload()
    rolPermission: CreateRolPermissionRequest,
  ) {
    try {
      return await this.createRolPermissionUseCase.execute(rolPermission);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.rol_permission.delete_rol_permission')
  async deleteRolPermission(@Payload() rolPermissionId: number) {
    try {
      return await this.deleteRolPermissionUseCase.execute(rolPermissionId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.rol_permission.update_rol_permission')
  async updateRolPermission(
    @Payload()
    payload: {
      rolPermissionId: number;
      rolPermission: UpdateRolPermissionRequest;
    },
  ) {
    try {
      return await this.updateRolPermissionUseCase.execute(
        payload.rolPermissionId,
        payload.rolPermission,
      );
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.rol_permission.get_rol_permission_by_id')
  async getRolPermissionById(@Payload() rolPermissionId: number) {
    try {
      return await this.findRolPermissionUseCase.findById(rolPermissionId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.rol_permission.get_all_rol_permissions')
  async getAllRolPermissions(
    @Payload() pagination: { limit: number; offset: number },
  ) {
    try {
      return await this.findRolPermissionUseCase.findAll(
        pagination.limit,
        pagination.offset,
      );
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.rol_permission.verify_rol_permission_exists')
  async verifyRolPermissionExists(
    @Payload() payload: { rolId: number; permissionId: number },
  ) {
    try {
      return await this.findRolPermissionUseCase.verifyExists(
        payload.rolId,
        payload.permissionId,
      );
    } catch (error) {
      this.handleException(error);
    }
  }
}
