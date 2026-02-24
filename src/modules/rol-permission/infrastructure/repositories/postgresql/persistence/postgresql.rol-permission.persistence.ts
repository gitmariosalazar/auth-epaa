import { Injectable } from '@nestjs/common';
import { DatabaseServicePostgreSQL } from '../../../../../../shared/connections/database/postgresql/postgresql.service';
import { InterfaceRolPermissionRepository } from '../../../../domain/contracts/rol-permission.interface.repository';
import { RolPermissionResponse } from '../../../../domain/schemas/dto/response/rol-permission.response';
import { RolPermissionModel } from '../../../../domain/schemas/models/rol-permission.model';
import { RolPermissionSQLResult } from '../../../interfaces/sql/rol-permission.sql.result';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { RolPermissionAdapter } from '../adapters/rol-permission.adapter';
import { Exists } from '../../../../../../shared/interfaces/verify-exists';

@Injectable()
export class RolPermissionPostgreSQLPersistence implements InterfaceRolPermissionRepository {
  constructor(private readonly postgreSQLService: DatabaseServicePostgreSQL) {}

  async createRolPermission(
    rolPermission: RolPermissionModel,
  ): Promise<RolPermissionResponse | null> {
    try {
      const query = `
        INSERT INTO rol_permisos (rol_id, permiso_id)
        VALUES ($1, $2)
        RETURNING rol_permiso_id AS "rol_permission_id",
                  rol_id AS "rol_id",
                  permiso_id AS "permission_id";
      `;

      const params = [
        rolPermission.getRolId(),
        rolPermission.getPermissionId(),
      ];

      const result = await this.postgreSQLService.query<RolPermissionSQLResult>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create rol-permission',
        });
      }

      const createdRolPermission: RolPermissionResponse =
        RolPermissionAdapter.fromRolPermissionSQLResultToRolPermissionResponse(
          result[0],
        );

      return createdRolPermission;
    } catch (error) {
      throw error;
    }
  }

  async updateRolPermission(
    rolPermissionId: number,
    rolPermission: RolPermissionModel,
  ): Promise<RolPermissionResponse | null> {
    try {
      const query = `
        UPDATE rol_permisos
        SET rol_id = $1, permiso_id = $2
        WHERE rol_permiso_id = $3
        RETURNING rol_permiso_id AS "rol_permission_id",
                  rol_id AS "rol_id",
                  permiso_id AS "permission_id";
      `;
      const params = [
        rolPermission.getRolId(),
        rolPermission.getPermissionId(),
        rolPermissionId,
      ];

      const result = await this.postgreSQLService.query<RolPermissionSQLResult>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'Rol-Permission not found',
        });
      }

      const updatedRolPermission: RolPermissionResponse =
        RolPermissionAdapter.fromRolPermissionSQLResultToRolPermissionResponse(
          result[0],
        );

      return updatedRolPermission;
    } catch (error) {
      throw error;
    }
  }

  async deleteRolPermission(rolPermissionId: number): Promise<boolean> {
    try {
      const query = `
        DELETE FROM rol_permisos
        WHERE rol_permiso_id = $1;
      `;
      const params = [rolPermissionId];

      const result = await this.postgreSQLService.query(query, params);

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'Rol-Permission not found',
        });
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async verifyRolPermissionExists(
    rolId: number,
    permissionId: number,
  ): Promise<boolean> {
    try {
      const query = `
        SELECT EXISTS (
          SELECT 1
          FROM rol_permisos
          WHERE rol_id = $1 AND permiso_id = $2
        ) AS exists;
      `;
      const params = [rolId, permissionId];

      const result = await this.postgreSQLService.query<Exists>(query, params);

      return result[0].exists;
    } catch (error) {
      throw error;
    }
  }

  async getRolPermissionById(
    rolPermissionId: number,
  ): Promise<RolPermissionResponse | null> {
    try {
      const query = `
        SELECT 
          rol_permiso_id AS "rol_permission_id",
          rol_id AS "rol_id",
          permiso_id AS "permission_id"
        FROM rol_permisos
        WHERE rol_permiso_id = $1;
      `;
      const params = [rolPermissionId];

      const result = await this.postgreSQLService.query<RolPermissionSQLResult>(
        query,
        params,
      );

      if (result.length === 0) {
        return null;
      }

      const rolPermission: RolPermissionResponse =
        RolPermissionAdapter.fromRolPermissionSQLResultToRolPermissionResponse(
          result[0],
        );

      return rolPermission;
    } catch (error) {
      throw error;
    }
  }

  async getAllRolPermissions(
    limit: number,
    offset: number,
  ): Promise<RolPermissionResponse[]> {
    try {
      const query = `
        SELECT 
          rol_permiso_id AS "rol_permission_id",
          rol_id AS "rol_id",
          permiso_id AS "permission_id"
        FROM rol_permisos
        ORDER BY rol_permiso_id
        LIMIT $1 OFFSET $2;
      `;
      const params = [limit, offset];

      const result = await this.postgreSQLService.query<RolPermissionSQLResult>(
        query,
        params,
      );

      return result.map((rolPermissionSQL) =>
        RolPermissionAdapter.fromRolPermissionSQLResultToRolPermissionResponse(
          rolPermissionSQL,
        ),
      );
    } catch (error) {
      throw error;
    }
  }
}
