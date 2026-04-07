import * as crypto from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { InterfaceAuthRepository } from '../../domain/contracts/auth.interface.repository';
import { AuthDomainException } from '../../domain/exceptions/auth.exceptions';
import { DatabaseServicePostgreSQL } from '../../../../shared/connections/database/postgresql/postgresql.service';
import { AuditContextStorage } from '../../../../shared/utils/audit-context.storage';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject('AuthRepository')
    private readonly authRepository: InterfaceAuthRepository,
    private readonly dbService: DatabaseServicePostgreSQL,
  ) {}

  async execute(userId: string, refreshToken?: string): Promise<void> {
    try {
      if (refreshToken) {
        // Revoke only this specific session
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const session = await this.authRepository.findSessionByTokenHash(tokenHash);
        if (session && session.getJti()) {
          await this.authRepository.invalidateRefreshToken(session.getJti()!);
        }
      } else {
        // Revoke all sessions for this user
        await this.authRepository.invalidateAllRefreshTokens(userId);
      }
      
      await this.logAccess(userId, 'N/A', 'LOGOUT');
    } catch (error) {
      throw new AuthDomainException('Error during logout process: ' + error.message);
    }
  }


  private async logAccess(userId: string | null, fallbackUsername: string, event: string) {
    const ctx = AuditContextStorage.getContext();
    const username = (ctx?.userName && ctx.userName !== 'Anonymous') ? ctx.userName : fallbackUsername;
    const userAgent = ctx?.userAgent || 'N/A';
    
    try {
      await this.dbService.query(
        `SELECT audit.fn_registrar_acceso($1, $2, $3, $4, $5)`,
        [userId, username, event, ctx?.ip || '0.0.0.0', userAgent]
      );
    } catch (error) {
      console.error('Error logging logout audit:', error);
    }
  }
}
