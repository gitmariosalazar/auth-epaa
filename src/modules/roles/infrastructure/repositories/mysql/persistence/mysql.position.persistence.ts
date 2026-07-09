import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { PositionRepository } from '../../../../domain/contracts/position.interface.repository';
import { PositionResponse } from '../../../../domain/schemas/dto/response/rol.response';
import { PositionSQLResponse } from '../../../interfaces/sql/position.sql.response';
import { PositionModel } from '../../../../domain/schemas/models/position.model';
import { PositionAdapter } from '../../../adapters/position.adapters';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';

const SELECT_COLUMNS = `
  cargo_id,
  nombre AS name,
  descripcion AS description,
  nivel_jerarquico AS level_jerarchy,
  activo AS is_active,
  created_at AS creation_date,
  updated_at
`;

@Injectable()
export class MySQLPositionPersistence implements PositionRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async getPositionById(positionId: number): Promise<PositionResponse | null> {
    try {
      const query = `SELECT ${SELECT_COLUMNS} FROM cargo WHERE cargo_id = ?;`;
      const result = await this.databaseService.query<PositionSQLResponse>(
        query,
        [positionId],
      );

      if (result.length === 0) {
        return null;
      }

      return PositionAdapter.fromPositionSqlResponseToPositionResponse(
        result[0],
      );
    } catch (error) {
      throw error;
    }
  }

  async getAllPositions(): Promise<PositionResponse[]> {
    try {
      const query = `
        SELECT ${SELECT_COLUMNS}
        FROM cargo
        ORDER BY nivel_jerarquico ASC, nombre ASC;
      `;
      const result = await this.databaseService.query<PositionSQLResponse>(
        query,
        [],
      );

      return result.map((row) =>
        PositionAdapter.fromPositionSqlResponseToPositionResponse(row),
      );
    } catch (error) {
      throw error;
    }
  }

  async createPosition(position: PositionModel): Promise<PositionResponse> {
    try {
      const query = `
        INSERT INTO cargo (nombre, descripcion, nivel_jerarquico, activo, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW());
      `;
      const params = [
        position.getName(),
        position.getDescription(),
        position.getLevelJerarchy(),
        position.getIsActive(),
      ];

      const result = await this.databaseService.execute(query, params);

      if (result.affectedRows === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create position',
        });
      }

      const rows = await this.databaseService
        .getClient()
        .then((c) =>
          c
            .query<PositionSQLResponse>(
              `SELECT ${SELECT_COLUMNS} FROM cargo WHERE cargo_id = ?`,
              [result.insertId],
            )
            .finally(() => c.release()),
        );

      return PositionAdapter.fromPositionSqlResponseToPositionResponse(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  async updatePosition(
    positionId: number,
    position: PositionModel,
  ): Promise<PositionResponse> {
    try {
      const query = `
        UPDATE cargo
        SET nombre           = ?,
            descripcion      = COALESCE(?, descripcion),
            nivel_jerarquico = ?,
            activo           = ?,
            updated_at       = NOW()
        WHERE cargo_id = ?;
      `;
      const params = [
        position.getName(),
        position.getDescription(),
        position.getLevelJerarchy(),
        position.getIsActive(),
        positionId,
      ];

      const result = await this.databaseService.execute(query, params);

      if (result.affectedRows === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Position with ID ${positionId} not found`,
        });
      }

      const rows = await this.databaseService
        .getClient()
        .then((c) =>
          c
            .query<PositionSQLResponse>(
              `SELECT ${SELECT_COLUMNS} FROM cargo WHERE cargo_id = ?`,
              [positionId],
            )
            .finally(() => c.release()),
        );

      return PositionAdapter.fromPositionSqlResponseToPositionResponse(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  async disablePosition(positionId: number): Promise<boolean> {
    try {
      const query = `UPDATE cargo SET activo = false, updated_at = NOW() WHERE cargo_id = ?;`;
      await this.databaseService.execute(query, [positionId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async existsByName(name: string): Promise<boolean> {
    try {
      const query = `SELECT 1 FROM cargo WHERE nombre = ?;`;
      const result = await this.databaseService.query(query, [name]);
      return result.length > 0;
    } catch (error) {
      throw error;
    }
  }

  async findByName(name: string): Promise<PositionResponse | null> {
    try {
      const query = `SELECT ${SELECT_COLUMNS} FROM cargo WHERE nombre = ?;`;
      const result = await this.databaseService.query<PositionSQLResponse>(
        query,
        [name],
      );

      if (result.length === 0) {
        return null;
      }

      return PositionAdapter.fromPositionSqlResponseToPositionResponse(
        result[0],
      );
    } catch (error) {
      throw error;
    }
  }
}
