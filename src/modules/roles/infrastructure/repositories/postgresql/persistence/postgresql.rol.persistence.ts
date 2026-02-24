import { Injectable } from '@nestjs/common';
import { DatabaseServicePostgreSQL } from '../../../../../../shared/connections/database/postgresql/postgresql.service';
import { InterfaceRolRepository } from '../../../../domain/contracts/rol.interface.repository';
import { RolResponse } from '../../../../domain/schemas/dto/response/rol.response';
import { RolSQLResponse } from '../../../interfaces/sql/rol.sql.response';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { RolAdapter } from '../adapters/rol.adapters';
import { RolModel } from '../../../../domain/schemas/models/rol.model';

@Injectable()
export class RolPostgreSQLPersistence implements InterfaceRolRepository {
  // Implement repository methods here
  constructor(private readonly postgreSQLService: DatabaseServicePostgreSQL) {}

  async getRolById(rolId: number): Promise<RolResponse | null> {
    try {
      const query: string = `
        SELECT
          rol_id as rol_id,
          nombre as name,
          descripcion as description,
          parent_rol_id as parent_rol_id,
          activo as is_active,
          fecha_creacion as creation_date
        FROM roles
        WHERE rol_id = $1;
      `;
      const params = [rolId];

      const result = await this.postgreSQLService.query<RolSQLResponse>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Rol with ID ${rolId} not found`,
        });
      }

      const rol: RolResponse = RolAdapter.fromRolSqlResponseToRolResponse(
        result[0],
      );

      return rol;
    } catch (error) {
      throw error;
    }
  }

  async getAllRols(limit: number, offset: number): Promise<RolResponse[]> {
    try {
      const query: string = `
        SELECT
          rol_id as rol_id,
          nombre as name,
          descripcion as description,
          parent_rol_id as parent_rol_id,
          activo as is_active,
          fecha_creacion as creation_date
        FROM roles
        ORDER BY fecha_creacion DESC
        LIMIT $1 OFFSET $2;
      `;
      const params = [limit, offset];

      const result = await this.postgreSQLService.query<RolSQLResponse>(
        query,
        params,
      );

      const rols: RolResponse[] = result.map((rolSql) =>
        RolAdapter.fromRolSqlResponseToRolResponse(rolSql),
      );

      return rols;
    } catch (error) {
      throw error;
    }
  }

  async createRol(rolModel: RolModel): Promise<RolResponse | null> {
    try {
      const query: string = `
        INSERT INTO roles (nombre, descripcion, parent_rol_id, activo, fecha_creacion)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING rol_id as rol_id,
                  nombre as name,
                  descripcion as description,
                  parent_rol_id as parent_rol_id,
                  activo as is_active,
                  fecha_creacion as creation_date;
      `;
      const params = [
        rolModel.getName(),
        rolModel.getDescription(),
        rolModel.getParentRolId(),
        rolModel.getIsActive(),
      ];

      const result = await this.postgreSQLService.query<RolSQLResponse>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create rol',
        });
      }

      const createdRol: RolResponse =
        RolAdapter.fromRolSqlResponseToRolResponse(result[0]);

      return createdRol;
    } catch (error) {
      throw error;
    }
  }

  async updateRol(
    rolId: number,
    rolModel: RolModel,
  ): Promise<RolResponse | null> {
    try {
      const query: string = `
        UPDATE roles
        SET nombre = $1,
            descripcion = COALESCE($2, descripcion),
            parent_rol_id = COALESCE($3, parent_rol_id),
            activo = COALESCE($4, activo)
        WHERE rol_id = $5
        RETURNING rol_id as rol_id,
                  nombre as name,
                  descripcion as description,
                  parent_rol_id as parent_rol_id,
                  activo as is_active,
                  fecha_creacion as creation_date;
      `;
      const params = [
        rolModel.getName(),
        rolModel.getDescription(),
        rolModel.getParentRolId(),
        rolModel.getIsActive(),
        rolId,
      ];

      const result = await this.postgreSQLService.query<RolSQLResponse>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Rol with ID ${rolId} not found`,
        });
      }

      const updatedRol: RolResponse =
        RolAdapter.fromRolSqlResponseToRolResponse(result[0]);

      return updatedRol;
    } catch (error) {
      throw error;
    }
  }

  async findByName(name: string): Promise<RolResponse | null> {
    try {
      const query: string = `
        SELECT
          rol_id as rol_id,
          nombre as name,
          descripcion as description,
          parent_rol_id as parent_rol_id,
          activo as is_active,
          fecha_creacion as creation_date
        FROM roles
        WHERE nombre = $1;
      `;
      const params = [name];

      const result = await this.postgreSQLService.query<RolSQLResponse>(
        query,
        params,
      );

      if (result.length === 0) {
        return null;
      }

      return RolAdapter.fromRolSqlResponseToRolResponse(result[0]);
    } catch (error) {
      throw error;
    }
  }

  async existsByName(name: string): Promise<boolean> {
    try {
      const query: string = `
        SELECT 1 FROM roles WHERE nombre = $1;
      `;
      const params = [name];

      const result = await this.postgreSQLService.query(query, params);

      return result.length > 0;
    } catch (error) {
      throw error;
    }
  }
}
