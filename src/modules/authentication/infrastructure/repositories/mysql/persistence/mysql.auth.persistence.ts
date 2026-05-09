import { AuthSQLResult } from '../../../interfaces/sql/auth.sql.result';
import { RefreshTokenSQLResult } from '../../../interfaces/sql/refresh-token.sql.result';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { Injectable } from '@nestjs/common';
import { InterfaceAuthRepository } from '../../../../domain/contracts/auth.interface.repository';
import { AuthRequest } from '../../../../domain/schemas/dto/request/auth.request';
import { AuthResponse } from '../../../../domain/schemas/dto/response/auth.response';
import { UserResponse } from '../../../../../users/domain/schemas/dto/response/user.response';
import { RefreshTokenRequest } from '../../../../domain/schemas/dto/request/refresh-token.request';
import { RefreshTokenModel } from '../../../../domain/schemas/models/refresh-token.model';

@Injectable()
export class MySQLAuthPersistence implements InterfaceAuthRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}
  async findSessionByTokenHash(
    tokenHash: string,
  ): Promise<RefreshTokenModel | null> {
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
        FROM sigepaa_audit.usuario_refresh_tokens 
        WHERE token_hash = ? AND revoked = FALSE AND expires_at > NOW()
      `;
      const result = await this.databaseService.query<RefreshTokenSQLResult>(
        query,
        [tokenHash],
      );

      if (result.length === 0) return null;

      const record = result[0];
      return new RefreshTokenModel({
        id: record.id,
        userId: record.usuario_id,
        tokenHash: record.token_hash,
        jti: record.jti,
        expiresAt: record.expires_at,
        revoked: Boolean(record.revoked),
        revokedAt: record.revoked_at,
        deviceInfo: record.device_info,
        ipAddress: record.ip_address,
        createdAt: record.created_at,
        lastUsedAt: record.last_used_at ?? new Date(),
      });
    } catch (error) {
      throw error;
    }
  }

  async invalidateAllRefreshTokens(userId: string): Promise<void> {
    try {
      const query = `
        UPDATE sigepaa_audit.usuario_refresh_tokens 
        SET revoked = TRUE, revoked_at = NOW() 
        WHERE usuario_id = ? AND revoked = FALSE
      `;
      await this.databaseService.query<AuthSQLResult>(query, [userId]);
    } catch (error) {
      throw error;
    }
  }

  async invalidateRefreshToken(jti: string): Promise<boolean> {
    try {
      const query = `
        UPDATE sigepaa_audit.usuario_refresh_tokens 
        SET revoked = TRUE, revoked_at = NOW() 
        WHERE jti = ? AND revoked = FALSE
      `;
      await this.databaseService.query<AuthSQLResult>(query, [jti]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async storeRefreshToken(refreshToken: RefreshTokenModel): Promise<boolean> {
    try {
      const query = `
        INSERT INTO sigepaa_audit.usuario_refresh_tokens (
          usuario_id, token_hash, jti, expires_at, ip_address, device_info
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;
      await this.databaseService.query<AuthSQLResult>(query, [
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
        UPDATE sigepaa_audit.usuario_refresh_tokens 
        SET last_used_at = ? 
        WHERE jti = ?
      `;
      await this.databaseService.query<AuthSQLResult>(query, [lastUsedAt, jti]);
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

  async logAccess(
    userId: string | null,
    username: string,
    event: string,
    ip: string,
    userAgent: string,
    reason: string | null = null,
  ): Promise<void> {
    try {
      await this.databaseService.query(
        `SELECT sigepaa_audit.fn_registrar_acceso(?, ?, ?, ?, ?, ?, ?)`,
        [userId, username, event, ip, userAgent, reason, '{}'],
      );
    } catch (error) {
      console.error('Error logging access audit:', error);
    }
  }
}
