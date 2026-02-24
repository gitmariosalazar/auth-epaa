import { RolResponse } from '../../../../domain/schemas/dto/response/rol.response';
import { RolSQLResponse } from '../../../interfaces/sql/rol.sql.response';

export class RolAdapter {
  static fromRolSqlResponseToRolResponse(
    rolSqlResponse: RolSQLResponse,
  ): RolResponse {
    return {
      rolId: rolSqlResponse.rol_id,
      name: rolSqlResponse.name,
      description: rolSqlResponse.description,
      parentRolId: rolSqlResponse.parent_rol_id,
      isActive: rolSqlResponse.is_active,
      creationDate: rolSqlResponse.creation_date,
    };
  }
}
