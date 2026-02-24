import { CreateRolPermissionRequest } from '../../domain/schemas/dto/request/create.rol-permission.request';
import { UpdateRolPermissionRequest } from '../../domain/schemas/dto/request/update.rol-permission.request';
import { RolPermissionResponse } from '../../domain/schemas/dto/response/rol-permission.response';
import { RolPermissionModel } from '../../domain/schemas/models/rol-permission.model';

export class RolPermissionMapper {
  static fromCreateRolPermisionRequestToRolPermissionModel(
    request: CreateRolPermissionRequest,
  ): RolPermissionModel {
    return new RolPermissionModel(0, request.rolId, request.permissionId);
  }

  static fromRolPermissionModelToCreateRolPermissionRequest(
    model: RolPermissionModel,
  ): CreateRolPermissionRequest {
    return new CreateRolPermissionRequest(
      model.getRolId(),
      model.getPermissionId(),
    );
  }

  static fromUpdateRolPermissionRequestToRolPermissionModel(
    rolPermissionId: number,
    request: UpdateRolPermissionRequest,
    existingModel: RolPermissionModel,
  ): RolPermissionModel {
    const rolId = request.rolId ?? existingModel.getRolId();
    const permissionId =
      request.permissionId ?? existingModel.getPermissionId();
    return new RolPermissionModel(rolPermissionId, rolId, permissionId);
  }

  static fromRolPermissionResponseToRolPermissionModel(
    response: RolPermissionResponse,
  ): RolPermissionModel {
    return new RolPermissionModel(
      response.rolPermissionId,
      response.rolId,
      response.permissionId,
    );
  }
}
