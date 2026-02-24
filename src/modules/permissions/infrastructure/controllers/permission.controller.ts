import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreatePermissionRequest } from '../../domain/schemas/dto/request/create.permission.request';
import { UpdatePermissionRequest } from '../../domain/schemas/dto/request/update.permission.request';
import { CreatePermissionUseCase } from '../../application/usecases/create-permission.usecase';
import { FindPermissionUseCase } from '../../application/usecases/find-permission.usecase';
import { UpdatePermissionUseCase } from '../../application/usecases/update-permission.usecase';
import { DeletePermissionUseCase } from '../../application/usecases/delete-permission.usecase';
import { PermissionDomainException } from '../../domain/exceptions/permission.exceptions';
import { statusCode } from '../../../../settings/environments/status-code';
import { GetPermissionsWithCategoryUseCase } from '../../application/usecases/get-permissions-with-category.usecase';
import { GetPermissionsByCategoryIdUseCase } from '../../application/usecases/get-permissions-by-categoryid.usecase';
import { GetPermissionSearchAdvancedUseCase } from '../../application/usecases/get-permission-search-advanced.usecase';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly findPermissionUseCase: FindPermissionUseCase,
    private readonly updatePermissionUseCase: UpdatePermissionUseCase,
    private readonly deletePermissionUseCase: DeletePermissionUseCase,
    private readonly getPermissionsWithCategoryUseCase: GetPermissionsWithCategoryUseCase,
    private readonly getPermissionsByCategoryIdUseCase: GetPermissionsByCategoryIdUseCase,
    private readonly getPermissionSearchAdvancedUseCase: GetPermissionSearchAdvancedUseCase,
  ) {}

  private handleException(error: any): never {
    if (error instanceof PermissionDomainException) {
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

  @MessagePattern('authentication.permission.verify-permission-exists-by-name')
  async verifyPermissionExistsByName(
    @Payload() permissionName: string,
  ): Promise<boolean> {
    try {
      return await this.findPermissionUseCase.verifyExistsByName(
        permissionName,
      );
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.permission.get-permission-by-id')
  async getPermissionById(@Payload() permissionId: number) {
    try {
      return await this.findPermissionUseCase.findById(permissionId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.permission.get-all-permissions')
  async getAllPermissions() {
    try {
      return await this.findPermissionUseCase.getAll();
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.permission.create-permission')
  async createPermission(@Payload() permission: CreatePermissionRequest) {
    try {
      return await this.createPermissionUseCase.execute(permission);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.permission.update-permission')
  async updatePermission(
    @Payload()
    data: {
      permissionId: number;
      permission: UpdatePermissionRequest;
    },
  ) {
    try {
      const { permissionId, permission } = data;
      return await this.updatePermissionUseCase.execute(
        permissionId,
        permission,
      );
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.permission.delete-permission')
  async deletePermission(@Payload() permissionId: number) {
    try {
      return await this.deletePermissionUseCase.execute(permissionId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.permission.get-permissions-with-category')
  async getPermissionsWithCategory() {
    try {
      return await this.getPermissionsWithCategoryUseCase.getPermissionsWithCategory();
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.permission.get-permissions-by-category-id')
  async getPermissionsByCategoryId(@Payload() categoryId: number) {
    try {
      return await this.getPermissionsByCategoryIdUseCase.getPermissionsByCategory(
        categoryId,
      );
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.permission.get-permission-search-advanced')
  async getPermissionSearchAdvanced(@Payload() search: string) {
    try {
      return await this.getPermissionSearchAdvancedUseCase.execute(search);
    } catch (error) {
      this.handleException(error);
    }
  }
}
