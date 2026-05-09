import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { Injectable } from '@nestjs/common';
import { InterfaceUserRepository } from '../../../../domain/contracts/user.interface.repository';
import {
  UserResponse,
  UserResponseWithPermissionsResponse,
  UserResponseWithRolesAndPermissionsResponse,
  UserResponseWithRolesResponse,
} from '../../../../domain/schemas/dto/response/user.response';
import {
  UserSQLResult,
  UserWithPermissionsSQLResult,
  UserWithRolesAndPermissionsSQLResult,
  UserWithRolesSQLResult,
} from '../../../interfaces/sql/user.sql.result';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { UserAdapter } from '../../../adapters/user.adapter';
import { UserModel } from '../../../../domain/schemas/models/user.model';
import { Exists } from '../../../../../../shared/interfaces/verify-exists';
import {
  AssignPermissionToUserRequest,
  RemovePermissionFromUserRequest,
} from '../../../../domain/schemas/dto/request/assign-permission-to-user.request';
import {
  AssignRoleToUserRequest,
  RemoveRoleFromUserRequest,
} from '../../../../domain/schemas/dto/request/assign-role-to-user.request';

@Injectable()
export class MySQLUserPersistence implements InterfaceUserRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}
  async getUsersByRoleId(roleId: number): Promise<UserResponse[]> {
    try {
      const query: string = `
        SELECT 
          u.usuario_id AS "user_id",
          u.username,
          u.email,
          u.fecha_registro AS "registered_at",
          u.last_login,
          u.failed_attempts,
          u.two_factor_enabled,
          u.activo AS "is_active",
          u.observaciones AS "observations"
        FROM usuarios u
        JOIN usuario_roles ur ON u.usuario_id = ur.usuario_id
        WHERE ur.rol_id = ?;
      `;
      const params = [roleId];

      const result =
        await this.databaseService.query<UserWithRolesAndPermissionsSQLResult>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'Users not found',
        });
      }

      const userResponses: UserResponse[] = result.map((user) =>
        UserAdapter.fromUserSQLResultToUserResponse(user),
      );

      return userResponses;
    } catch (error) {
      throw error;
    }
  }

  /*
  User Table
  CREATE TABLE usuarios (
    usuario_id UUID PRIMARY KEY DEFAULT UUID(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    failed_attempts INTEGER NOT NULL DEFAULT 0 CHECK (failed_attempts >= 0),
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    observaciones VARCHAR(255)
);
  */

  async findByUsernameOrEmailWithRolesAndPermissions(
    usernameOrEmail: string,
  ): Promise<UserResponseWithRolesAndPermissionsResponse | null> {
    try {
      const query: string = `
        SELECT
            u.usuario_id        AS "user_id",
            u.username          AS "username",
            u.email             AS "email",
            e.nombres           AS "first_name",
            e.apellidos         AS "last_name",
            u.fecha_registro    AS "registered_at",
            u.last_login        AS "last_login",
            u.failed_attempts   AS "failed_attempts",
            u.two_factor_enabled,
            u.activo            AS "is_active",
            u.observaciones     AS "observations",
            u.password_hash     AS "password_hash",

            -- Roles (using JSON_ARRAYAGG + subquery)
            COALESCE(
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', r.rol_id, 'name', r.nombre))
                FROM usuario_roles ur2
                JOIN roles r ON r.rol_id = ur2.rol_id
                WHERE ur2.usuario_id = u.usuario_id),
                JSON_ARRAY()
            ) AS roles,   -- cast back to json if your app expects json (not jsonb)

            -- Permissions: union + deduplicate before aggregation
            COALESCE(
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', p.permiso_id, 'name', p.nombre))
                FROM (
                    -- Permissions vía roles
                    SELECT DISTINCT rp.permiso_id
                    FROM usuario_roles ur2
                    JOIN rol_permisos rp ON rp.rol_id = ur2.rol_id
                    WHERE ur2.usuario_id = u.usuario_id
                    UNION
                    -- Permisos directos
                    SELECT DISTINCT up.permiso_id
                    FROM usuario_permisos up
                    WHERE up.usuario_id = u.usuario_id
                ) src
                JOIN permisos p ON p.permiso_id = src.permiso_id
                ),
                JSON_ARRAY()
            ) AS permissions

        FROM usuarios u
        LEFT JOIN empleados e on u.usuario_id = e.usuario_id
        WHERE u.username = ? OR u.email = ?;
      `;
      const params = [usernameOrEmail, usernameOrEmail];
      const result: UserWithRolesAndPermissionsSQLResult[] =
        await this.databaseService.query<UserWithRolesAndPermissionsSQLResult>(
          query,
          params,
        );
      console.log('Result from DB:', result[0].is_active);
      if (result.length === 0) {
        return null;
      }

      const userResponse: UserResponseWithRolesAndPermissionsResponse =
        UserAdapter.fromUserWithRolesAndPermissionsSQLResultToUserWithRolesAndPermissionsResponse(
          result[0],
        );

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async findByIdWithRolesAndPermissions(
    userId: string,
  ): Promise<UserResponseWithRolesAndPermissionsResponse | null> {
    try {
      const query: string = `
        SELECT
            u.usuario_id        AS "user_id",
            u.username          AS "username",
            u.email             AS "email",
            e.nombres           AS "first_name",
            e.apellidos         AS "last_name",
            u.fecha_registro    AS "registered_at",
            u.last_login        AS "last_login",
            u.failed_attempts   AS "failed_attempts",
            u.two_factor_enabled,
            u.activo            AS "is_active",
            u.observaciones     AS "observations",
            u.password_hash     AS "password_hash",

            -- Roles
            COALESCE(
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', r.rol_id, 'name', r.nombre))
                FROM usuario_roles ur2
                JOIN roles r ON r.rol_id = ur2.rol_id
                WHERE ur2.usuario_id = u.usuario_id),
                JSON_ARRAY()
            ) AS roles,

            -- Permissions
            COALESCE(
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', p.permiso_id, 'name', p.nombre))
                FROM (
                    SELECT DISTINCT rp.permiso_id
                    FROM usuario_roles ur2
                    JOIN rol_permisos rp ON rp.rol_id = ur2.rol_id
                    WHERE ur2.usuario_id = u.usuario_id
                    UNION
                    SELECT DISTINCT up.permiso_id
                    FROM usuario_permisos up
                    WHERE up.usuario_id = u.usuario_id
                ) src
                JOIN permisos p ON p.permiso_id = src.permiso_id
                ),
                JSON_ARRAY()
            ) AS permissions

        FROM usuarios u
        LEFT JOIN empleados e on u.usuario_id = e.usuario_id
        WHERE u.usuario_id = ?;
      `;
      const params = [userId];
      const result =
        await this.databaseService.query<UserWithRolesAndPermissionsSQLResult>(
          query,
          params,
        );
      if (result.length === 0) {
        return null;
      }

      const userResponse: UserResponseWithRolesAndPermissionsResponse =
        UserAdapter.fromUserWithRolesAndPermissionsSQLResultToUserWithRolesAndPermissionsResponse(
          result[0],
        );

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    try {
      const query: string = `
        SELECT 
          usuario_id AS "user_id",
          username,
          email,
          fecha_registro AS "registered_at",
          last_login,
          failed_attempts,
          two_factor_enabled,
          activo AS "is_active",
          observaciones AS "observations"
        FROM usuarios
        WHERE email = ?;
      `;
      const params = [email];

      const result =
        await this.databaseService.query<UserWithRolesAndPermissionsSQLResult>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      const userResponse: UserResponse =
        UserAdapter.fromUserSQLResultToUserResponse(result[0]);

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async findById(userId: string): Promise<UserResponse | null> {
    try {
      const query: string = `
        SELECT 
          usuario_id AS "user_id",
          username,
          email,
          fecha_registro AS "registered_at",
          last_login,
          failed_attempts,
          two_factor_enabled,
          activo AS "is_active",
          observaciones AS "observations"
        FROM usuarios
        WHERE usuario_id = ?;
      `;
      const params = [userId];

      const result = await this.databaseService.query<UserWithRolesSQLResult>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      const userResponse: UserResponse =
        UserAdapter.fromUserSQLResultToUserResponse(result[0]);

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async findByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<UserResponse | null> {
    try {
      const query: string = `
        SELECT 
          usuario_id AS "user_id",
          username,
          email,
          fecha_registro AS "registered_at",
          last_login,
          failed_attempts,
          two_factor_enabled,
          activo AS "is_active",
          observaciones AS "observations"
        FROM usuarios
        WHERE username = ? OR email = ?;
      `;
      const params = [username, email];

      const result = await this.databaseService.query<any>(query, params);

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      const userResponse: UserResponse =
        UserAdapter.fromUserSQLResultToUserResponse(result[0]);

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async findByRefreshToken(token: string): Promise<UserResponse | null> {
    try {
      const query: string = `
        SELECT 
          usuario_id AS "user_id",
          username,
          email,
          fecha_registro AS "registered_at",
          last_login,
          failed_attempts,
          two_factor_enabled,
          activo AS "is_active",
          observaciones AS "observations"
        FROM usuarios
        WHERE refresh_token = ?;
      `;
      const params = [token];

      const result = await this.databaseService.query<UserSQLResult>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      const userResponse: UserResponse =
        UserAdapter.fromUserSQLResultToUserResponse(result[0]);

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async findByUsername(username: string): Promise<UserResponse | null> {
    try {
      const query: string = `
        SELECT 
          usuario_id AS "user_id",
          username,
          email,
          fecha_registro AS "registered_at",
          last_login,
          failed_attempts,
          two_factor_enabled,
          activo AS "is_active",
          observaciones AS "observations"
        FROM usuarios
        WHERE username = ?;
      `;
      const params = [username];

      const result = await this.databaseService.query<UserSQLResult>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      const userResponse: UserResponse =
        UserAdapter.fromUserSQLResultToUserResponse(result[0]);

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async createUser(user: UserModel): Promise<UserResponse | null> {
    try {
      const query: string = `
        INSERT INTO usuarios (
          username,
          email,
          password_hash
        ) VALUES (?, ?, ?);
      `;
      const params = [
        user.getUsername(),
        user.getEmail(),
        user.getPasswordHash(),
      ];

      const result = await this.databaseService.execute(query, params);

      if (result.affectedRows === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error creating user',
        });
      }

      const rows = await this.databaseService
        .getClient()
        .then((c) =>
          c
            .query<UserSQLResult>(
              'SELECT usuario_id AS user_id, username, email, fecha_registro AS registered_at, last_login, failed_attempts, two_factor_enabled, activo AS is_active, observaciones AS observations FROM usuarios WHERE usuario_id = ?',
              [result.insertId],
            )
            .finally(() => c.release()),
        );

      return UserAdapter.fromUserSQLResultToUserResponse(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  async incrementFailedAttempts(userId: string): Promise<void> {
    try {
      const query: string = `
        UPDATE usuarios
        SET failed_attempts = failed_attempts + 1
        WHERE usuario_id = ?;
      `;
      const params = [userId];

      await this.databaseService.execute(query, params);
    } catch (error) {
      throw error;
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const query: string = `
        SELECT EXISTS (
          SELECT 1 FROM usuarios WHERE email = ?
        ) AS "exists";
      `;
      const params = [email];

      const result = await this.databaseService.query<any>(query, params);

      return result[0].exists;
    } catch (error) {
      throw error;
    }
  }

  async existsByUsername(username: string): Promise<boolean> {
    try {
      const query: string = `
        SELECT EXISTS (
          SELECT 1 FROM usuarios WHERE username = ?
        ) AS "exists";
      `;
      const params = [username];

      const result = await this.databaseService.query<any>(query, params);

      return result[0].exists;
    } catch (error) {
      throw error;
    }
  }

  async existsByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<boolean> {
    try {
      const query: string = `
        SELECT EXISTS (
          SELECT 1 FROM usuarios WHERE username = ? OR email = ?
        ) AS "exists";
      `;
      const params = [username, email];

      const result = await this.databaseService.query<any>(query, params);

      return result[0].exists;
    } catch (error) {
      throw error;
    }
  }

  async resetFailedAttempts(userId: string): Promise<void> {
    try {
      const query: string = `
        UPDATE usuarios
        SET failed_attempts = 0
        WHERE usuario_id = ?;
      `;
      const params = [userId];

      await this.databaseService.execute(query, params);
    } catch (error) {
      throw error;
    }
  }

  async softDelete(userId: string): Promise<void> {
    try {
      const query: string = `
        UPDATE usuarios
        SET activo = FALSE
        WHERE usuario_id = ?;
      `;
      const params = [userId];

      await this.databaseService.execute(query, params);
    } catch (error) {
      throw error;
    }
  }

  async restore(userId: string): Promise<UserResponse | null> {
    try {
      const query: string = `
        UPDATE usuarios
        SET activo = TRUE
        WHERE usuario_id = ?;
      `;
      const params = [userId];

      const result = await this.databaseService.execute(query, params);

      if (result.affectedRows === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      const selectResult = await this.databaseService.query<any>(
        'SELECT usuario_id AS user_id, username, email, fecha_registro AS registered_at, last_login, failed_attempts, two_factor_enabled, activo AS is_active, observaciones AS observations FROM usuarios WHERE usuario_id = ?',
        [userId],
      );

      const userResponse: UserResponse =
        UserAdapter.fromUserSQLResultToUserResponse(selectResult[0]);

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(
    userId: string,
    updates: Partial<UserModel>,
  ): Promise<UserResponse | null> {
    try {
      const query: string = `
        UPDATE usuarios
        SET
          username = COALESCE(?, username),
          email = COALESCE(?, email),
          password_hash = COALESCE(?, password_hash),
          last_login = COALESCE(?, last_login),
          two_factor_enabled = COALESCE(?, two_factor_enabled),
          observaciones = COALESCE(?, observaciones)
        WHERE usuario_id = ?;
      `;
      const params = [
        updates.getUsername?.(),
        updates.getEmail?.(),
        updates.getPasswordHash?.(),
        updates.getLastLogin?.(),
        updates.isTwoFactorEnabled?.(),
        updates.getObservations?.(),
        userId,
      ];

      const result = await this.databaseService.query<any>(query, params);

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      const userResponse: UserResponse =
        UserAdapter.fromUserSQLResultToUserResponse(result[0]);

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async verifyCredentials(
    username: string,
    password: string,
  ): Promise<UserResponse | null> {
    try {
      const query: string = `
        SELECT 
          usuario_id AS "user_id",
          username,
          email,
          fecha_registro AS "registered_at",
          last_login,
          failed_attempts,
          two_factor_enabled,
          activo AS "is_active",
          observaciones AS "observations"
        FROM usuarios
        WHERE username = ? AND password_hash = ?;
      `;
      const params = [username, password];

      const result = await this.databaseService.query<UserSQLResult>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Invalid credentials',
        });
      }

      const userResponse: UserResponse =
        UserAdapter.fromUserSQLResultToUserResponse(result[0]);

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async changeUserPassword(
    userId: string,
    hashedPassword: string,
  ): Promise<UserResponse | null> {
    try {
      const query: string = `
        UPDATE usuarios
        SET password_hash = ?
        WHERE usuario_id = ?;
      `;
      const params = [hashedPassword, userId];

      const result = await this.databaseService.query<UserSQLResult>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      const userResponse: UserResponse =
        UserAdapter.fromUserSQLResultToUserResponse(result[0]);

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async findAllUsers(
    limit: number,
    offset: number,
  ): Promise<UserResponseWithRolesAndPermissionsResponse[]> {
    try {
      const query: string = `
        SELECT
            u.usuario_id        AS "user_id",
            u.username,
            u.email,
            e.nombres         AS "first_name",
            e.apellidos       AS "last_name",
            e.fecha_nacimiento AS "date_of_birth",
            e.sexo_id AS "sex_id",
            e.cedula AS "card_id",
            e.ciudadano_id AS "citizen_id",
            e.cargo_id AS "position_id",
            e.tipo_contrato_id AS "contract_type_id",
            e.estado_empleado_id AS "employee_status_id",
            e.fecha_ingreso AS "hire_date",
            e.fecha_salida AS "termination_date",
            e.salario_base AS "base_salary",
            e.supervisor_id AS "supervisor_id",
            e.zonas_asignadas AS "assigned_zones",
            e.licencia_conducir AS "driver_license",
            e.tiene_vehiculo_empresa AS "has_company_vehicle",
            e.telefono_interno AS "internal_phone",
            e.email_interno AS "internal_email",
            e.foto_url AS "photo_url",
            e.created_by AS "created_by",
            u.fecha_registro    AS "registered_at",
            u.last_login,
            u.failed_attempts,
            u.two_factor_enabled,
            u.activo            AS "is_active",
            u.observaciones     AS "observations",
            u.password_hash,
            COALESCE(
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', r.rol_id, 'name', r.nombre))
                FROM usuario_roles ur2
                JOIN roles r ON r.rol_id = ur2.rol_id
                WHERE ur2.usuario_id = u.usuario_id),
                JSON_ARRAY()
            ) AS roles,
            COALESCE(
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', p.permiso_id, 'name', p.nombre))
                FROM (
                    -- Permissions vía roles
                    SELECT DISTINCT rp.permiso_id
                    FROM usuario_roles ur2
                    JOIN rol_permisos rp ON rp.rol_id = ur2.rol_id
                    WHERE ur2.usuario_id = u.usuario_id
                    UNION
                    -- Permisos directos
                    SELECT DISTINCT up.permiso_id
                    FROM usuario_permisos up
                    WHERE up.usuario_id = u.usuario_id
                ) src
                JOIN permisos p ON p.permiso_id = src.permiso_id
                ),
                JSON_ARRAY()
            ) AS permissions
        FROM usuarios u
        LEFT JOIN empleados e on u.usuario_id = e.usuario_id
        LIMIT ? OFFSET ?;
      `;
      const params = [Number(limit), Number(offset)];

      const result =
        await this.databaseService.query<UserWithRolesAndPermissionsSQLResult>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'Users not found',
        });
      }

      const userResponses: UserResponseWithRolesAndPermissionsResponse[] =
        result.map((user) =>
          UserAdapter.fromUserWithRolesAndPermissionsSQLResultToUserWithRolesAndPermissionsResponse(
            user,
          ),
        );

      return userResponses;
    } catch (error) {
      throw error;
    }
  }

  async assignPermissionToUser(
    assignPermissionToUserRequest: AssignPermissionToUserRequest,
  ): Promise<boolean> {
    try {
      const query: string = `
        INSERT INTO usuario_permisos (usuario_id, permiso_id)
        VALUES (?, ?)
        RETURNING usuario_id, permiso_id;
      `;
      const params = [
        assignPermissionToUserRequest.userId,
        assignPermissionToUserRequest.permissionId,
      ];

      const result =
        await this.databaseService.query<UserWithRolesAndPermissionsSQLResult>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async removePermissionFromUser(
    removePermissionFromUserRequest: RemovePermissionFromUserRequest,
  ): Promise<boolean> {
    try {
      const query: string = `
        DELETE FROM usuario_permisos
        WHERE usuario_id = ? AND permiso_id = ?
        RETURNING usuario_id, permiso_id;
      `;
      const params = [
        removePermissionFromUserRequest.userId,
        removePermissionFromUserRequest.permissionId,
      ];

      const result =
        await this.databaseService.query<UserWithRolesAndPermissionsSQLResult>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async existsPermissionInUser(
    userId: string,
    permissionId: number,
  ): Promise<boolean> {
    try {
      const query: string = `
        SELECT EXISTS (
          SELECT 1
          FROM usuario_permisos
          WHERE usuario_id = ? AND permiso_id = ?
        );
      `;
      const params = [userId, permissionId];

      const result = await this.databaseService.query<any>(query, params);

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      return result[0].exists;
    } catch (error) {
      throw error;
    }
  }

  async getUsersByPermissionId(permissionId: number): Promise<UserResponse[]> {
    try {
      const query: string = `
        SELECT 
          u.usuario_id AS "user_id",
          u.username,
          u.email,
          u.fecha_registro AS "registered_at",
          u.last_login,
          u.failed_attempts,
          u.two_factor_enabled,
          u.activo AS "is_active",
          u.observaciones AS "observations"
        FROM usuarios u
        JOIN usuario_permisos up ON u.usuario_id = up.usuario_id
        WHERE up.permiso_id = ?;
      `;
      const params = [permissionId];

      const result = await this.databaseService.query<any>(query, params);

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'Users not found',
        });
      }

      const userResponses: UserResponse[] = result.map((user) =>
        UserAdapter.fromUserSQLResultToUserResponse(user),
      );

      return userResponses;
    } catch (error) {
      throw error;
    }
  }

  async getPermissionsByUserId(
    userId: string,
  ): Promise<UserResponseWithPermissionsResponse[]> {
    try {
      const query: string = `
        SELECT 
          u.usuario_id AS "user_id",
          u.username,
          u.email,
          u.fecha_registro AS "registered_at",
          u.last_login,
          u.failed_attempts,
          u.two_factor_enabled,
          u.activo AS "is_active",
          u.observaciones AS "observations",
          COALESCE(
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', p.permiso_id, 'name', p.nombre))
             FROM usuario_permisos up
             JOIN permisos p ON up.permiso_id = p.permiso_id
             WHERE up.usuario_id = u.usuario_id
            ), JSON_ARRAY()
          ) AS permissions
        FROM usuarios u
        WHERE u.usuario_id = ?;
      `;
      const params = [userId];

      const result =
        await this.databaseService.query<UserWithPermissionsSQLResult>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      const userResponses: UserResponseWithPermissionsResponse[] = result.map(
        (user) =>
          UserAdapter.fromUserWithPermissionsSQLResultToUserWithPermissionsResponse(
            user,
          ),
      );

      return userResponses;
    } catch (error) {
      throw error;
    }
  }

  async assignRoleToUser(
    assignRoleToUserRequest: AssignRoleToUserRequest,
  ): Promise<boolean> {
    try {
      const query: string = `
        INSERT INTO usuario_roles (usuario_id, rol_id)
        VALUES (?, ?)
        RETURNING usuario_id, rol_id;
      `;
      const params = [
        assignRoleToUserRequest.userId,
        assignRoleToUserRequest.roleId,
      ];

      const result = await this.databaseService.query<any>(query, params);

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async removeRoleFromUser(
    removeRoleFromUserRequest: RemoveRoleFromUserRequest,
  ): Promise<boolean> {
    try {
      const query: string = `
        DELETE FROM usuario_roles
        WHERE usuario_id = ? AND rol_id = ?
        RETURNING usuario_id, rol_id;
      `;
      const params = [
        removeRoleFromUserRequest.userId,
        removeRoleFromUserRequest.roleId,
      ];

      const result = await this.databaseService.query<UserSQLResult>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async existsRoleInUser(userId: string, roleId: number): Promise<boolean> {
    try {
      const query: string = `
        SELECT EXISTS (
          SELECT 1
          FROM usuario_roles
          WHERE usuario_id = ? AND rol_id = ?
        );
      `;
      const params = [userId, roleId];

      const result = await this.databaseService.query<any>(query, params);

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      return result[0].exists;
    } catch (error) {
      throw error;
    }
  }

  async getRolesByUserId(
    userId: string,
  ): Promise<UserResponseWithRolesResponse[]> {
    try {
      const query: string = `
        SELECT 
          u.usuario_id AS "user_id",
          u.username,
          u.email,
          u.fecha_registro AS "registered_at",
          u.last_login,
          u.failed_attempts,
          u.two_factor_enabled,
          u.activo AS "is_active",
          u.observaciones AS "observations",
          COALESCE(
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', r.rol_id, 'name', r.nombre))
             FROM usuario_roles ur
             JOIN roles r ON ur.rol_id = r.rol_id
             WHERE ur.usuario_id = u.usuario_id
            ), JSON_ARRAY()
          ) AS roles
        FROM usuarios u
        WHERE u.usuario_id = ?;
      `;
      const params = [userId];

      const result = await this.databaseService.query<UserWithRolesSQLResult>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      const userResponses: UserResponseWithRolesResponse[] = result.map(
        (user) =>
          UserAdapter.fromUserWithRolesSQLResultToUserWithRolesResponse(user),
      );

      return userResponses;
    } catch (error) {
      throw error;
    }
  }

  async getRolesAndPermissionsByUserId(
    userId: string,
  ): Promise<UserResponseWithRolesAndPermissionsResponse[]> {
    try {
      const query: string = `
        SELECT 
          u.usuario_id AS "user_id",
          u.username,
          u.email,
          u.fecha_registro AS "registered_at",
          u.last_login,
          u.failed_attempts,
          u.two_factor_enabled,
          u.activo AS "is_active",
          u.observaciones AS "observations",
          COALESCE(
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', r.rol_id, 'name', r.nombre))
             FROM usuario_roles ur
             JOIN roles r ON ur.rol_id = r.rol_id
             WHERE ur.usuario_id = u.usuario_id
            ), JSON_ARRAY()
          ) AS roles,
          COALESCE(
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', p.permiso_id, 'name', p.nombre))
             FROM usuario_permisos up
             JOIN permisos p ON up.permiso_id = p.permiso_id
             WHERE up.usuario_id = u.usuario_id
            ), JSON_ARRAY()
          ) AS permissions
        FROM usuarios u
        WHERE u.usuario_id = ?;
      `;
      const params = [userId];

      const result =
        await this.databaseService.query<UserWithRolesAndPermissionsSQLResult>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'User not found',
        });
      }

      const userResponses: UserResponseWithRolesAndPermissionsResponse[] =
        result.map((user) =>
          UserAdapter.fromUserWithRolesAndPermissionsSQLResultToUserWithRolesAndPermissionsResponse(
            user,
          ),
        );

      return userResponses;
    } catch (error) {
      throw error;
    }
  }
}
