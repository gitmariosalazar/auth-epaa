import {
  CategoryResponseWithPermissions,
  PermissionResponse,
} from '../../../../domain/schemas/dto/response/permission.response';
import {
  CategorySqlResponseWithPermissions,
  PermissionSQLResponse,
} from '../../../interfaces/sql/permission.sql.interface';

export class PermissionSQLAdapter {
  static toPermissionResponse(
    sqlResponse: PermissionSQLResponse,
  ): PermissionResponse {
    return {
      permissionId: sqlResponse.permission_id,
      permissionName: sqlResponse.permission_name,
      permissionDescription: sqlResponse.permission_description,
      isActive: sqlResponse.is_active,
      categoryId: sqlResponse.category_id,
      scoppes: sqlResponse.scoppes,
    };
  }

  static toCategoryResponseWithPermissions(
    sqlResponse: CategorySqlResponseWithPermissions,
  ): CategoryResponseWithPermissions {
    return {
      categoryId: sqlResponse.category_id,
      categoryName: sqlResponse.category_name,
      categoryDescription: sqlResponse.category_description,
      categoryIsActive: sqlResponse.category_is_active,
      scopes: sqlResponse.scopes,
      permissions: sqlResponse.permissions.map((sqlPermission) =>
        this.toPermissionResponse(sqlPermission),
      ),
    };
  }
}
