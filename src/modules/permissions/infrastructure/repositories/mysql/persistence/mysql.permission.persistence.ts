import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { Injectable } from '@nestjs/common';
import { InterfacePermissionRepository } from '../../../../domain/contracts/permission.interface.repository';
import {
  CategoryResponseWithPermissions,
  PermissionResponse,
} from '../../../../domain/schemas/dto/response/permission.response';
import {
  CategorySqlResponseWithPermissions,
  PermissionSQLResponse,
} from '../../../interfaces/sql/permission.sql.interface';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { PermissionModel } from '../../../../domain/schemas/models/permission.model';
import { PermissionSQLAdapter } from '../../../adapters/permission.adapter';

@Injectable()
export class PermissionMySQLPersistence
  implements InterfacePermissionRepository
{
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async verifyPermissionExistsByName(permissionName: string): Promise<boolean> {
    try {
      const query: string = `
        SELECT EXISTS (
          SELECT 1
          FROM permisos
          WHERE nombre = ?
        ) AS \`exists\`;
      `;
      const params = [permissionName];

      const result = await this.databaseService.query<any>(query, params);

      return result[0].exists;
    } catch (error) {
      throw error;
    }
  }

  async getPermissionById(
    permissionId: number,
  ): Promise<PermissionResponse | null> {
    try {
      const query: string = `
        SELECT
          permiso_id AS permission_id,
          nombre AS permission_name,
          descripcion AS permission_description,
          activo AS is_active,
          categoria_id AS category_id
        FROM permisos
        WHERE permiso_id = ?;
      `;
      const params = [permissionId];

      const result = await this.databaseService.query<PermissionSQLResponse>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Permission with ID ${permissionId} not found`,
        });
      }

      const permission: PermissionResponse =
        PermissionSQLAdapter.toPermissionResponse(result[0]);

      return permission;
    } catch (error) {
      throw error;
    }
  }

  async getAllPermissions(): Promise<PermissionResponse[]> {
    try {
      const query: string = `
        SELECT
          permiso_id AS permission_id,
          nombre AS permission_name,
          descripcion AS permission_description,
          activo AS is_active,
          categoria_id AS category_id
        FROM permisos;
      `;

      const result = await this.databaseService.query<PermissionSQLResponse>(
        query,
        [],
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No permissions found',
        });
      }

      return result.map((permissionSql) =>
        PermissionSQLAdapter.toPermissionResponse(permissionSql),
      );
    } catch (error) {
      throw error;
    }
  }

  async deletePermission(permissionId: number): Promise<boolean> {
    try {
      const query: string = `
        DELETE FROM permisos
        WHERE permiso_id = ?;
      `;
      const params = [permissionId];

      const result = await this.databaseService.execute(query, params);

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  async createPermission(
    permission: PermissionModel,
  ): Promise<PermissionResponse | null> {
    try {
      const query: string = `
        INSERT INTO permisos (nombre, descripcion, activo, categoria_id)
        VALUES (?, ?, ?, ?);
      `;
      const params = [
        permission.getName(),
        permission.getDescription(),
        permission.getIsActive(),
        permission.getCategoryId(),
      ];

      const result = await this.databaseService.execute(query, params);

      if (result.affectedRows === 0) {
        return null;
      }

      const rows = await this.databaseService.getClient().then(c => c.query<PermissionSQLResponse>('SELECT permiso_id AS permission_id, nombre AS permission_name, descripcion AS permission_description, activo AS is_active, categoria_id AS category_id FROM permisos WHERE permiso_id = ?', [result.insertId]).finally(() => c.release()));

      return PermissionSQLAdapter.toPermissionResponse(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  async updatePermission(
    permissionId: number,
    permission: PermissionModel,
  ): Promise<PermissionResponse | null> {
    try {
      const query: string = `
        UPDATE permisos
        SET nombre = ?,
            descripcion = ?,
            activo = ?,
            categoria_id = ?
        WHERE permiso_id = ?;
      `;
      const params = [
        permission.getName(),
        permission.getDescription(),
        permission.getIsActive(),
        permission.getCategoryId(),
        permissionId,
      ];

      const result = await this.databaseService.execute(query, params);

      if (result.affectedRows === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to update permission',
        });
      }

      const rows = await this.databaseService.getClient().then(c => c.query<PermissionSQLResponse>('SELECT permiso_id AS permission_id, nombre AS permission_name, descripcion AS permission_description, activo AS is_active, categoria_id AS category_id FROM permisos WHERE permiso_id = ?', [permissionId]).finally(() => c.release()));

      return PermissionSQLAdapter.toPermissionResponse(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  async getPermissionsByCategoryId(
    categoryId: number,
  ): Promise<CategoryResponseWithPermissions | null> {
    try {
      const query: string = `
        SELECT
          pc.categoria_id    AS category_id,
          pc.nombre           AS category_name,
          pc.descripcion      AS category_description,
          pc.activo           AS category_is_active,

          COALESCE(
            (
              SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                      'permission_id', p.permiso_id,
                      'permission_name', p.nombre,
                      'permission_description', p.descripcion,
                      'scopes', p.scopes,
                      'is_active', p.activo,
                      'category_id', p.categoria_id
                  )
              )
              FROM permisos p
              WHERE p.categoria_id = pc.categoria_id
            ),
            JSON_ARRAY()
          ) AS permissions
      FROM permiso_categoria pc
      WHERE pc.categoria_id = ?
      ORDER BY pc.nombre;
      `;
      const params = [categoryId];

      const result =
        await this.databaseService.query<CategorySqlResponseWithPermissions>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Category with ID ${categoryId} not found`,
        });
      }

      const category: CategoryResponseWithPermissions =
        PermissionSQLAdapter.toCategoryResponseWithPermissions(result[0]);

      return category;
    } catch (error) {
      throw error;
    }
  }

  async getPermissionsWithCategory(): Promise<
    CategoryResponseWithPermissions[]
  > {
    try {
      const query: string = `
        SELECT
          pc.categoria_id    AS category_id,
          pc.nombre           AS category_name,
          pc.descripcion      AS category_description,
          pc.activo           AS category_is_active,

          COALESCE(
            (
              SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                      'permission_id', p.permiso_id,
                      'permission_name', p.nombre,
                      'permission_description', p.descripcion,
                      'scopes', p.scopes,
                      'is_active', p.activo,
                      'category_id', p.categoria_id
                  )
              )
              FROM permisos p
              WHERE p.categoria_id = pc.categoria_id
            ),
            JSON_ARRAY()
          ) AS permissions
      FROM permiso_categoria pc
      ORDER BY pc.nombre;
      `;

      const result =
        await this.databaseService.query<CategorySqlResponseWithPermissions>(
          query,
          [],
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No permissions found',
        });
      }

      const categories: CategoryResponseWithPermissions[] = result.map(
        (categorySql) =>
          PermissionSQLAdapter.toCategoryResponseWithPermissions(categorySql),
      );

      return categories;
    } catch (error) {
      throw error;
    }
  }

  async getPermissionSearchAdvanced(
    search: string,
  ): Promise<PermissionResponse[]> {
    try {
      const query: string = `
        SELECT
          p.permiso_id    AS permission_id,
          p.nombre           AS permission_name,
          p.descripcion      AS permission_description,
          p.scopes           AS scopes,
          p.activo           AS is_active,
          p.categoria_id    AS category_id
        FROM permisos p
        WHERE p.nombre LIKE ? OR p.descripcion LIKE ?;
      `;
      const params = [`%${search}%`, `%${search}%`];

      const result = await this.databaseService.query<PermissionSQLResponse>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No permissions found',
        });
      }

      const permissions: PermissionResponse[] = result.map((permissionSql) =>
        PermissionSQLAdapter.toPermissionResponse(permissionSql),
      );

      return permissions;
    } catch (error) {
      throw error;
    }
  }
}
