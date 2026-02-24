import { Injectable } from '@nestjs/common';
import { DatabaseServicePostgreSQL } from '../../../../../../shared/connections/database/postgresql/postgresql.service';
import { InterfaceAuthRepository } from '../../../../domain/contracts/auth.interface.repository';
import { AuthRequest } from '../../../../domain/schemas/dto/request/auth.request';
import { AuthResponse } from '../../../../domain/schemas/dto/response/auth.response';
import { UserResponse } from '../../../../../users/domain/schemas/dto/response/user.response';
import { RefreshTokenRequest } from '../../../../domain/schemas/dto/request/refresh-token.request';
import { RefreshTokenModel } from '../../../../domain/schemas/models/refresh-token.model';

@Injectable()
export class PostgreSQLAuthPersistence implements InterfaceAuthRepository {
  constructor(private readonly postgreSQLService: DatabaseServicePostgreSQL) {}
  refreshToken(refreshRequest: RefreshTokenRequest): Promise<AuthResponse> {
    throw new Error('Method not implemented.');
  }
  invalidateAllRefreshTokens(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findByRefreshToken(token: string): Promise<UserResponse | null> {
    throw new Error('Method not implemented.');
  }
  lockAccount(userId: string, durationMinutes: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  isAccountLocked(userId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  initiatePasswordReset(email: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  resetPassword(token: string, newPassword: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async storeRefreshToken(refreshToken: RefreshTokenModel): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      throw error;
    }
  }
  deleteRefreshToken(jti: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
