import { AuthResponse } from '../../../../domain/schemas/dto/response/auth.response';
import { AuthSQLResult } from '../../../interfaces/sql/auth.sql.result';

export class AuthAdapter {
  static fromAuthSQLResultToAuthResponse(
    sqlResult: AuthSQLResult,
    accessToken: string,
    refreshToken: string,
  ): AuthResponse {
    return {
      accessToken,
      refreshToken,
      user: {
        userId: sqlResult.user_id,
        username: sqlResult.username,
        email: sqlResult.email,
        roles: sqlResult.roles,
        firstName: sqlResult.first_name,
        lastName: sqlResult.last_name,
        isActive: sqlResult.is_active,
        permissions: [], // Defaulting to empty array to fix build error
      },
    };
  }
}
