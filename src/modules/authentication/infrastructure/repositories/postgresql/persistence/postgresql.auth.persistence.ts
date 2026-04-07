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
  async findSessionByTokenHash(tokenHash: string): Promise<RefreshTokenModel | null> {
    try {
      const query = `
        SELECT 
          token_id as id, 
          usuario_id, 
          token_hash, 
          jti, 
          expires_at, 
          revoked, 
          revoked_at, 
          device_info, 
          ip_address, 
          created_at, 
          last_used_at
        FROM audit.usuario_refresh_tokens 
        WHERE token_hash = $1 AND revoked = FALSE AND expires_at > NOW()
      `;
      const result = await this.postgreSQLService.query<any>(query, [tokenHash]);
      
      if (result.length === 0) return null;
      
      const record = result[0];
      return new RefreshTokenModel({
        id: record.id,
        userId: record.usuario_id,
        tokenHash: record.token_hash,
        jti: record.jti,
        expiresAt: record.expires_at,
        revoked: record.revoked,
        revokedAt: record.revoked_at,
        deviceInfo: record.device_info,
        ipAddress: record.ip_address,
        createdAt: record.created_at,
        lastUsedAt: record.last_used_at,
      });
    } catch (error) {
      throw error;
    }
  }

  async invalidateAllRefreshTokens(userId: string): Promise<void> {
    try {
      const query = `
        UPDATE audit.usuario_refresh_tokens 
        SET revoked = TRUE, revoked_at = NOW() 
        WHERE usuario_id = $1 AND revoked = FALSE
      `;
      await this.postgreSQLService.query(query, [userId]);
    } catch (error) {
      throw error;
    }
  }
  
  async invalidateRefreshToken(jti: string): Promise<boolean> {
    try {
      const query = `
        UPDATE audit.usuario_refresh_tokens 
        SET revoked = TRUE, revoked_at = NOW() 
        WHERE jti = $1 AND revoked = FALSE
      `;
      await this.postgreSQLService.query(query, [jti]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async storeRefreshToken(refreshToken: RefreshTokenModel): Promise<boolean> {
    try {
      const query = `
        INSERT INTO audit.usuario_refresh_tokens (
          usuario_id, token_hash, jti, expires_at, ip_address, device_info
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await this.postgreSQLService.query(query, [
        refreshToken.getUserId(),
        refreshToken.getTokenHash(),
        refreshToken.getJti(),
        refreshToken.getExpiresAt(),
        refreshToken.getIpAddress(),
        refreshToken.getDeviceInfo(),
      ]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async updateLastUsed(jti: string, lastUsedAt: Date): Promise<void> {
    try {
      const query = `
        UPDATE audit.usuario_refresh_tokens 
        SET last_used_at = $1 
        WHERE jti = $2
      `;
      await this.postgreSQLService.query(query, [lastUsedAt, jti]);
    } catch (error) {
      throw error;
    }
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

}
