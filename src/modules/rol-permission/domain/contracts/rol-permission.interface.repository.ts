import { RolPermissionResponse } from '../schemas/dto/response/rol-permission.response';
import { RolPermissionModel } from '../schemas/models/rol-permission.model';

export interface InterfaceRolPermissionRepository {
  createRolPermission(
    rolPermission: RolPermissionModel,
  ): Promise<RolPermissionResponse | null>;
  deleteRolPermission(rolPermissionId: number): Promise<boolean>;
  updateRolPermission(
    rolPermissionId: number,
    rolPermission: RolPermissionModel,
  ): Promise<RolPermissionResponse | null>;
  getRolPermissionById(
    rolPermissionId: number,
  ): Promise<RolPermissionResponse | null>;
  getAllRolPermissions(
    limit: number,
    offset: number,
  ): Promise<RolPermissionResponse[]>;
  verifyRolPermissionExists(
    rolId: number,
    permissionId: number,
  ): Promise<boolean>;
}
