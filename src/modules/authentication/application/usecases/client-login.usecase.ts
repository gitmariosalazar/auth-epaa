import * as crypto from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { InterfaceClientAuthRepository } from '../../domain/contracts/client-auth.interface.repository';
import { ClientAuthRequest } from '../../domain/schemas/dto/request/client-auth.request';
import { AuthResponse } from '../../domain/schemas/dto/response/auth.response';
import { AuthMapper } from '../mappers/auth.mapper';
import { validateFields } from '../../../../shared/validators/fields.validators';
import {
  AuthDomainException,
  InvalidCredentialsException,
} from '../../domain/exceptions/auth.exceptions';
import { environments } from '../../../../settings/environments/environments';
import { parseExpirationToSeconds } from '../../../../shared/utils/time.util';
import { CreateRefreshTokenRequest } from '../../domain/schemas/dto/request/create.refresh-token.request';
import { RefreshTokenModel } from '../../domain/schemas/models/refresh-token.model';
import { AuditContextStorage } from '../../../../shared/utils/audit-context.storage';

@Injectable()
export class ClientLoginUseCase {
  constructor(
    @Inject('ClientAuthRepository')
    private readonly clientAuthRepository: InterfaceClientAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(authRequest: ClientAuthRequest): Promise<AuthResponse> {
    const requiredFields = ['username_or_email', 'password'];
    const missingFields = validateFields(authRequest, requiredFields);

    if (missingFields.length > 0) {
      throw new AuthDomainException(missingFields.join(', '));
    }

    const client = await this.clientAuthRepository.findClientByUsernameOrEmail(
      authRequest.username_or_email,
    );
    const ctx = AuditContextStorage.getContext();

    if (!client) {
      await this.clientAuthRepository.logClientAccess(
        null,
        authRequest.username_or_email,
        'LOGIN_FAILED',
        ctx?.ip || '0.0.0.0',
        ctx?.userAgent || 'N/A',
        'Cliente no registrado',
      );
      throw new InvalidCredentialsException();
    }

    if (!client.isActive) {
      throw new AuthDomainException(
        'La cuenta de usuario no está activa o requiere verificación.',
      );
    }

    if (
      client.isLockedOut &&
      client.lockoutUntil &&
      client.lockoutUntil > new Date()
    ) {
      throw new AuthDomainException(
        'La cuenta se encuentra bloqueada temporalmente.',
      );
    }

    const passwordMatches = await bcrypt.compare(
      authRequest.password || '',
      client.passwordHash,
    );
    if (!passwordMatches) {
      await this.clientAuthRepository.logClientAccess(
        client.clientUserId,
        authRequest.username_or_email,
        'LOGIN_FAILED',
        ctx?.ip || '0.0.0.0',
        ctx?.userAgent || 'N/A',
        'Contraseña incorrecta',
      );
      throw new InvalidCredentialsException();
    }

    // Inyección de metadata clave para el Gateway
    const payload = {
      sub: client.clientUserId,
      cliente_id: client.clienteId,
      email: client.email,
      user_type: 'customer',
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: environments.JWT_SECRET,
      expiresIn: parseExpirationToSeconds(environments.JWT_ACCESS_EXPIRATION),
      algorithm: 'HS256',
    });

    const refreshToken = uuidv4();
    const jti = uuidv4();
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    const refreshTokenExpiresInSeconds = parseExpirationToSeconds(
      environments.JWT_REFRESH_EXPIRATION,
    );
    const expiresAt = new Date(
      Date.now() + refreshTokenExpiresInSeconds * 1000,
    );

    const createRefreshTokenDto = new CreateRefreshTokenRequest();
    createRefreshTokenDto.userId = client.clientUserId;
    createRefreshTokenDto.expiresInSeconds = refreshTokenExpiresInSeconds;
    createRefreshTokenDto.deviceInfo = ctx?.userAgent || 'Unknown Device';
    createRefreshTokenDto.ipAddress = ctx?.ip || '0.0.0.0';

    const refreshTokenModel = AuthMapper.toRefreshTokenModel(
      createRefreshTokenDto,
      tokenHash,
      jti,
      expiresAt,
      new Date(),
    );

    await this.clientAuthRepository.storeRefreshToken(refreshTokenModel);

    await this.clientAuthRepository.logClientAccess(
      client.clientUserId,
      client.email,
      'LOGIN',
      ctx?.ip || '0.0.0.0',
      ctx?.userAgent || 'N/A',
    );

    return AuthMapper.fromClientUserModelToAuthResponse(
      client,
      accessToken,
      refreshToken,
    );
  }
}
