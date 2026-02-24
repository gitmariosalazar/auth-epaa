import {
  CategoryResponseWithPermissions,
  PermissionResponse,
} from '../schemas/dto/response/permission.response';
import { PermissionModel } from '../schemas/models/permission.model';

export interface InterfacePermissionRepository {
  createPermission(
    permission: PermissionModel,
  ): Promise<PermissionResponse | null>;
  updatePermission(
    permissionId: number,
    permission: PermissionModel,
  ): Promise<PermissionResponse | null>;
  deletePermission(permissionId: number): Promise<boolean>;
  getPermissionById(permissionId: number): Promise<PermissionResponse | null>;
  getAllPermissions(): Promise<PermissionResponse[]>;
  verifyPermissionExistsByName(permissionName: string): Promise<boolean>;
  getPermissionsWithCategory(): Promise<CategoryResponseWithPermissions[]>;
  getPermissionsByCategoryId(
    categoryId: number,
  ): Promise<CategoryResponseWithPermissions | null>;
  getPermissionSearchAdvanced(search: string): Promise<PermissionResponse[]>;
}
