import * as crypto from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { InterfaceAuthRepository } from '../../domain/contracts/auth.interface.repository';
import { AuthDomainException } from '../../domain/exceptions/auth.exceptions';
import { AuditContextStorage } from '../../../../shared/utils/audit-context.storage';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject('AuthRepository')
    private readonly authRepository: InterfaceAuthRepository,
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
      
      const ctx = AuditContextStorage.getContext();
      const username = (ctx?.userName && ctx.userName !== 'Anonymous') ? ctx.userName : 'N/A';
      await this.authRepository.logAccess(
        userId, 
        username, 
        'LOGOUT',
        ctx?.ip || '0.0.0.0',
        ctx?.userAgent || 'N/A'
      );
    } catch (error) {
      throw new AuthDomainException('Error during logout process: ' + error.message);
    }
  }


}
