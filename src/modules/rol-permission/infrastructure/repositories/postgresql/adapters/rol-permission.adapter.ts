import { RolPermissionResponse } from '../../../../domain/schemas/dto/response/rol-permission.response';
import { RolPermissionSQLResult } from '../../../interfaces/sql/rol-permission.sql.result';

export class RolPermissionAdapter {
  static fromRolPermissionSQLResultToRolPermissionResponse(
    result: RolPermissionSQLResult,
  ): RolPermissionResponse {
    return {
      rolPermissionId: result.rol_permission_id,
      rolId: result.rol_id,
      permissionId: result.permission_id,
    };
  }
}
