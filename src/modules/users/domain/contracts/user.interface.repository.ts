import {
  AssignPermissionToUserRequest,
  RemovePermissionFromUserRequest,
} from '../schemas/dto/request/assign-permission-to-user.request';
import {
  AssignRoleToUserRequest,
  RemoveRoleFromUserRequest,
} from '../schemas/dto/request/assign-role-to-user.request';
import {
  UserResponse,
  UserResponseWithPermissionsResponse,
  UserResponseWithRolesAndPermissionsResponse,
  UserResponseWithRolesResponse,
} from '../schemas/dto/response/user.response';
import { UserModel } from '../schemas/models/user.model';

export interface InterfaceUserRepository {
  // Búsquedas básicas
  findById(userId: string): Promise<UserResponse | null>;
  findByUsername(username: string): Promise<UserResponse | null>;
  findByEmail(email: string): Promise<UserResponse | null>;
  findByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<UserResponse | null>;

  findByUsernameOrEmailWithRolesAndPermissions(
    usernameOrEmail: string,
  ): Promise<UserResponseWithRolesAndPermissionsResponse | null>;

  findAllUsers(
    limit: number,
    offset: number,
  ): Promise<UserResponseWithRolesAndPermissionsResponse[]>;

  // Existencia (para validaciones rápidas)
  existsByUsername(username: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  existsByUsernameOrEmail(username: string, email: string): Promise<boolean>;

  // CRUD
  createUser(user: UserModel): Promise<UserResponse | null>;
  updateUser(
    userId: string,
    updates: Partial<UserModel>,
  ): Promise<UserResponse | null>;
  softDelete(userId: string): Promise<void>;
  restore(userId: string): Promise<UserResponse | null>;
  // Autenticación y seguridad
  verifyCredentials(
    username: string,
    password: string,
  ): Promise<UserResponse | null>;
  changeUserPassword(
    userId: string,
    hashedPassword: string,
  ): Promise<UserResponse | null>;
  incrementFailedAttempts(userId: string): Promise<void>;
  resetFailedAttempts(userId: string): Promise<void>;

  // Opcional: si usas refresh tokens
  findByRefreshToken(token: string): Promise<UserResponse | null>;

  // Roles
  assignRoleToUser(
    assignRoleToUserRequest: AssignRoleToUserRequest,
  ): Promise<boolean>;
  removeRoleFromUser(
    removeRoleFromUserRequest: RemoveRoleFromUserRequest,
  ): Promise<boolean>;
  getRolesByUserId(userId: string): Promise<UserResponseWithRolesResponse[]>;
  getUsersByRoleId(roleId: number): Promise<UserResponse[]>;
  existsRoleInUser(userId: string, roleId: number): Promise<boolean>;

  // Permissions
  assignPermissionToUser(
    assignPermissionToUserRequest: AssignPermissionToUserRequest,
  ): Promise<boolean>;
  removePermissionFromUser(
    removePermissionFromUserRequest: RemovePermissionFromUserRequest,
  ): Promise<boolean>;
  getPermissionsByUserId(
    userId: string,
  ): Promise<UserResponseWithPermissionsResponse[]>;
  getUsersByPermissionId(permissionId: number): Promise<UserResponse[]>;
  existsPermissionInUser(
    userId: string,
    permissionId: number,
  ): Promise<boolean>;
}
