import { PositionResponse } from '../../domain/schemas/dto/response/rol.response';
import { PositionSQLResponse } from '../interfaces/sql/position.sql.response';

export class PositionAdapter {
  static fromPositionSqlResponseToPositionResponse(
    sql: PositionSQLResponse,
  ): PositionResponse {
    return {
      positionId: sql.cargo_id,
      name: sql.name,
      levelJerarchy: sql.level_jerarchy,
      description: sql.description,
      isActive: Boolean(sql.is_active),
      creationDate: sql.creation_date,
      updatedAt: sql.updated_at,
    };
  }
}
