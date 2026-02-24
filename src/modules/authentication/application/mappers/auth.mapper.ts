import { UserResponseWithRolesAndPermissionsResponse } from '../../../users/domain/schemas/dto/response/user.response';
import { CreateRefreshTokenRequest } from '../../domain/schemas/dto/request/create.refresh-token.request';
import { AuthResponse } from '../../domain/schemas/dto/response/auth.response';
import { RefreshTokenModel } from '../../domain/schemas/models/refresh-token.model';

export class AuthMapper {
  /**
   * Mapea el DTO de creación + datos ya calculados a un RefreshTokenModel
   * @param dto Datos de entrada del flujo (userId, expiresInSeconds, deviceInfo, ip)
   * @param tokenHash Hash ya calculado del refresh token plano
   * @param jti Identificador único ya generado
   * @param expiresAt Fecha de expiración ya calculada
   * @param createdAt Fecha de creación (normalmente Date.now())
   * @param lastUsedAt Fecha de último uso (normalmente igual a createdAt al inicio)
   */
  static toRefreshTokenModel(
    dto: CreateRefreshTokenRequest,
    tokenHash: string,
    jti: string,
    expiresAt: Date,
    createdAt: Date,
    lastUsedAt: Date = createdAt, // por defecto mismo valor que createdAt
  ): RefreshTokenModel {
    return new RefreshTokenModel({
      id: '', //no lo pasamos → la base de datos lo genera (BIGSERIAL)
      userId: dto.userId,
      tokenHash,
      jti,
      expiresAt,
      revoked: false,
      revokedAt: null,
      deviceInfo: dto.deviceInfo ?? null,
      ipAddress: dto.ipAddress ?? null,
      createdAt,
      lastUsedAt,
    });
  }

  /**
   * Versión alternativa más corta si prefieres pasar menos parámetros
   * (asumiendo que createdAt y lastUsedAt son el mismo valor al crear)
   */
  static toNewRefreshTokenModel(
    dto: CreateRefreshTokenRequest,
    tokenHash: string,
    jti: string,
    expiresAt: Date,
    now: Date = new Date(),
  ): RefreshTokenModel {
    return new RefreshTokenModel({
      id: '', //no lo pasamos → la base de datos lo genera (BIGSERIAL)
      userId: dto.userId,
      tokenHash,
      jti,
      expiresAt,
      revoked: false,
      revokedAt: null,
      deviceInfo: dto.deviceInfo ?? null,
      ipAddress: dto.ipAddress ?? null,
      createdAt: now,
      lastUsedAt: now,
    });
  }

  /**
   * Mapper desde registro de base de datos a modelo de dominio
   * (muy útil cuando lees de Prisma/TypeORM)
   */
  static fromDatabaseToModel(dbRecord: {
    id: bigint | string;
    usuario_id: bigint | string;
    token_hash: string;
    jti: string | null;
    expires_at: Date;
    revoked: boolean;
    revoked_at: Date | null;
    device_info: string | null;
    ip_address: string | null;
    created_at: Date;
    last_used_at: Date;
  }): RefreshTokenModel {
    return new RefreshTokenModel({
      id: dbRecord.id.toString(),
      userId: dbRecord.usuario_id.toString(),
      tokenHash: dbRecord.token_hash,
      jti: dbRecord.jti ?? undefined,
      expiresAt: dbRecord.expires_at,
      revoked: dbRecord.revoked,
      revokedAt: dbRecord.revoked_at,
      deviceInfo: dbRecord.device_info,
      ipAddress: dbRecord.ip_address,
      createdAt: dbRecord.created_at,
      lastUsedAt: dbRecord.last_used_at,
    });
  }

  static fromUserWithRolesAndPermissionsToUserResponse(
    user: UserResponseWithRolesAndPermissionsResponse,
    refreshToken: string,
    accessToken: string,
  ): AuthResponse {
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions,
        firstName:
          user.username === 'root' ? 'Root' : user.firstName || 'Sin Nombre',
        lastName:
          user.username === 'root' ? 'User' : user.lastName || 'Sin Apellido',
        isActive: user.isActive,
      },
    };
  }
}
