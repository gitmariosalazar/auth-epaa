import { CreatePermissionRequest } from '../../domain/schemas/dto/request/create.permission.request';
import { UpdatePermissionRequest } from '../../domain/schemas/dto/request/update.permission.request';
import { PermissionResponse } from '../../domain/schemas/dto/response/permission.response';
import { PermissionModel } from '../../domain/schemas/models/permission.model';

export class PermissionMapper {
  static fromCreatePermissionRequestToPermissionModel(
    request: CreatePermissionRequest,
  ): PermissionModel {
    return new PermissionModel(
      0,
      request.permissionName,
      request.permissionDescription,
      request.isActive,
      request.categoryId,
      request.scoppes,
    );
  }

  static fromUpdatePermissionRequestToPermissionModel(
    permissionId: number,
    request: UpdatePermissionRequest,
    existingPermission: PermissionModel,
  ): PermissionModel {
    const updatedPermissionName =
      request.permissionName ?? existingPermission.getName();
    const updatedPermissionDescription =
      request.permissionDescription ?? existingPermission.getDescription();
    const updatedIsActive =
      request.isActive ?? existingPermission.getIsActive();
    const updatedCategoryId =
      request.categoryId ?? existingPermission.getCategoryId();
    const updatedScoppes = request.scoppes ?? existingPermission.getScoppes();

    return new PermissionModel(
      permissionId,
      updatedPermissionName,
      updatedPermissionDescription,
      updatedIsActive,
      updatedCategoryId,
      updatedScoppes,
    );
  }

  static fromPermissionModelToPermissionResponse(
    model: PermissionModel,
  ): PermissionResponse {
    return {
      permissionId: model.getId(),
      permissionName: model.getName(),
      permissionDescription: model.getDescription(),
      isActive: model.getIsActive(),
      categoryId: model.getCategoryId(),
      scoppes: model.getScoppes(),
    };
  }

  static fromPermissionResponseToPermissionModel(
    response: PermissionResponse,
  ): PermissionModel {
    return new PermissionModel(
      response.permissionId,
      response.permissionName,
      response.permissionDescription,
      response.isActive,
      response.categoryId,
      response.scoppes,
    );
  }
}
