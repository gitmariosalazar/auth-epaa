import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InterfaceAuthRepository } from '../../domain/contracts/auth.interface.repository';
import { InterfaceUserRepository } from '../../../users/domain/contracts/user.interface.repository';
import { InterfaceClientAuthRepository } from '../../domain/contracts/client-auth.interface.repository';
import { ClientUserModel } from '../../domain/schemas/models/client-user.model';
import { RefreshTokenRequest } from '../../domain/schemas/dto/request/refresh-token.request';
import { AuthResponse } from '../../domain/schemas/dto/response/auth.response';
import { AuthDomainException, InvalidCredentialsException, TokenExpiredException } from '../../domain/exceptions/auth.exceptions';
import { environments } from '../../../../settings/environments/environments';
import { parseExpirationToSeconds } from '../../../../shared/utils/time.util';
import { RefreshTokenModel } from '../../domain/schemas/models/refresh-token.model';
import { AuditContextStorage } from '../../../../shared/utils/audit-context.storage';
import { CreateRefreshTokenRequest } from '../../domain/schemas/dto/request/create.refresh-token.request';
import { AuthMapper } from '../mappers/auth.mapper';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('AuthRepository')
    private readonly authRepository: InterfaceAuthRepository,
    @Inject('UserRepository')
    private readonly userRepository: InterfaceUserRepository,
    @Inject('ClientAuthRepository')
    private readonly clientAuthRepository: InterfaceClientAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(request: RefreshTokenRequest): Promise<AuthResponse> {
    const { refreshToken: incomingToken } = request;

    if (!incomingToken) {
      throw new AuthDomainException('Refresh token is required');
    }

    // Hash the incoming token to find the session
    const tokenHash = crypto.createHash('sha256').update(incomingToken).digest('hex');
    const session = await this.authRepository.findSessionByTokenHash(tokenHash);

    // Validate session
    if (!session) {
      throw new InvalidCredentialsException();
    }

    if (session.isRevoked()) {
      throw new AuthDomainException('This refresh token has been revoked');
    }

    if (session.getExpiresAt() < new Date()) {
      throw new TokenExpiredException();
    }

    // Get user details (try employees first, then clients)
    let user = await this.userRepository.findByIdWithRolesAndPermissions(session.getUserId());
    let isClient = false;
    let clientUser: ClientUserModel | null = null;

    if (!user) {
      clientUser = await this.clientAuthRepository.findClientById(session.getUserId());
      if (!clientUser || !clientUser.isActive) {
        throw new InvalidCredentialsException();
      }
      isClient = true;
    } else {
      if (!user.isActive) {
        throw new InvalidCredentialsException();
      }
    }

    // Generate new Access Token payload
    let payload;
    if (isClient && clientUser) {
      payload = {
        sub: clientUser.clientUserId,
        cliente_id: clientUser.clienteId,
        email: clientUser.email,
        user_type: 'customer',
      };
    } else {
      payload = {
        sub: user!.userId,
        username: user!.username,
        email: user!.email,
        roles: user!.roles,
        permissions: user!.permissions,
      };
    }

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: environments.JWT_SECRET,
      expiresIn: parseExpirationToSeconds(environments.JWT_ACCESS_EXPIRATION),
      algorithm: 'HS256',
    });

    // --- REFRESH TOKEN ROTATION ---
    // 1. Invalidate current token (single use)
    await this.authRepository.invalidateRefreshToken(session.getJti()!);

    // 2. Generate new Refresh Token
    const newRefreshToken = uuidv4();
    const newJti = uuidv4();
    const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    
    const refreshTokenExpiresInSeconds = parseExpirationToSeconds(environments.JWT_REFRESH_EXPIRATION);
    const expiresAt = new Date(Date.now() + refreshTokenExpiresInSeconds * 1000);

    const ctx = AuditContextStorage.getContext();
    const createRefreshTokenDto = new CreateRefreshTokenRequest();
    createRefreshTokenDto.userId = isClient ? clientUser!.clientUserId : user!.userId;

    createRefreshTokenDto.expiresInSeconds = refreshTokenExpiresInSeconds;
    createRefreshTokenDto.deviceInfo = ctx?.userAgent || 'Unknown Device';
    createRefreshTokenDto.ipAddress = ctx?.ip || '0.0.0.0';

    const newRefreshTokenModel: RefreshTokenModel = AuthMapper.toRefreshTokenModel(
      createRefreshTokenDto,
      newTokenHash,
      newJti,
      expiresAt,
      new Date(),
    );

    await this.authRepository.storeRefreshToken(newRefreshTokenModel);

    // 3. Return both new tokens with proper structures
    if (isClient && clientUser) {
      return AuthMapper.fromClientUserModelToAuthResponse(
        clientUser,
        accessToken,
        newRefreshToken,
      );
    }

    return AuthMapper.fromUserWithRolesAndPermissionsToUserResponse(
      user!,
      newRefreshToken,
      accessToken,
    );
  }
}
