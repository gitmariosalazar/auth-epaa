import { UserResponse } from '../../../users/domain/schemas/dto/response/user.response';
import { AuthRequest } from '../schemas/dto/request/auth.request';
import { RefreshTokenRequest } from '../schemas/dto/request/refresh-token.request';
import { AuthResponse } from '../schemas/dto/response/auth.response';
import { RefreshTokenModel } from '../schemas/models/refresh-token.model';

/**
 * Interfaz del repositorio de autenticación (solo operaciones de auth y seguridad).
 * - No incluye CRUD de usuarios ni roles/permisos.
 * - Retorna UserResponse seguro (sin passwordHash).
 * - Lanza excepciones específicas.
 */
export interface InterfaceAuthRepository {
  // Autenticación principal
  //authenticateUser(authRequest: AuthRequest): Promise<AuthResponse>;

  // Gestión de tokens y sesiones
  findSessionByTokenHash(tokenHash: string): Promise<RefreshTokenModel | null>;
  invalidateAllRefreshTokens(userId: string): Promise<void>;
  invalidateRefreshToken(jti: string): Promise<boolean>;

  // Refresh token management
  storeRefreshToken(refreshToken: RefreshTokenModel): Promise<boolean>;
  updateLastUsed(jti: string, lastUsedAt: Date): Promise<void>;

  // Seguridad y bloqueo
  lockAccount(userId: string, durationMinutes: number): Promise<void>;
  isAccountLocked(userId: string): Promise<boolean>;

  // Cambio de contraseña y recuperación
  initiatePasswordReset(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;

  // Audit
  logAccess(userId: string | null, username: string, event: string, ip: string, userAgent: string, reason?: string | null): Promise<void>;

  // 2FA (opcional pero recomendado)
  /*
  enableTwoFactor(userId: string, secret: string): Promise<void>;
  disableTwoFactor(userId: string): Promise<void>;
  verifyTwoFactorCode(userId: string, code: string): Promise<boolean>;
  */
}
