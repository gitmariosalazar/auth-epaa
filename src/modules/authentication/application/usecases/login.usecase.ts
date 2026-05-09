import * as crypto from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { InterfaceAuthRepository } from '../../domain/contracts/auth.interface.repository';
import { InterfaceUserRepository } from '../../../users/domain/contracts/user.interface.repository';
import { AuthRequest } from '../../domain/schemas/dto/request/auth.request';
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
export class LoginUseCase {
  constructor(
    @Inject('AuthRepository')
    private readonly authRepository: InterfaceAuthRepository,
    @Inject('UserRepository')
    private readonly userRepository: InterfaceUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(authRequest: AuthRequest): Promise<AuthResponse> {
    const requiredFields: string[] = ['username_or_email', 'password'];
    const missingFieldsMessages: string[] = validateFields(
      authRequest,
      requiredFields,
    );

    if (missingFieldsMessages.length > 0) {
      throw new AuthDomainException(missingFieldsMessages.join(', '));
    }

    const user =
      await this.userRepository.findByUsernameOrEmailWithRolesAndPermissions(
        authRequest.username_or_email,
      );

    if (!user) {
      const ctx = AuditContextStorage.getContext();
      await this.authRepository.logAccess(
        null, 
        authRequest.username_or_email, 
        'LOGIN_FAILED', 
        ctx?.ip || '0.0.0.0', 
        ctx?.userAgent || 'N/A', 
        'Usuario no existe'
      );
      throw new InvalidCredentialsException();
    }

    const passwordMatches = await bcrypt.compare(
      authRequest.password,
      user.passwordHash || '',
    );

    if (!passwordMatches) {
      const ctx = AuditContextStorage.getContext();
      await this.authRepository.logAccess(
        null, 
        authRequest.username_or_email, 
        'LOGIN_FAILED', 
        ctx?.ip || '0.0.0.0', 
        ctx?.userAgent || 'N/A', 
        'Contraseña incorrecta'
      );
      throw new InvalidCredentialsException();
    }

    const payload = {
      sub: user.userId,
      username: user.username,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: environments.JWT_SECRET,
      expiresIn: parseExpirationToSeconds(environments.JWT_ACCESS_EXPIRATION),
      algorithm: 'HS256',
    });

    const refreshToken = uuidv4();
    const jti = uuidv4();
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const refreshTokenExpiresInSeconds = parseExpirationToSeconds(environments.JWT_REFRESH_EXPIRATION);
    const expiresAt = new Date(Date.now() + refreshTokenExpiresInSeconds * 1000);

    const ctx = AuditContextStorage.getContext();
    
    const createRefreshTokenDto = new CreateRefreshTokenRequest();
    createRefreshTokenDto.userId = user.userId;
    createRefreshTokenDto.expiresInSeconds = refreshTokenExpiresInSeconds;
    createRefreshTokenDto.deviceInfo = ctx?.userAgent || 'Unknown Device'; // Using userAgent/deviceInfo if available in ctx
    createRefreshTokenDto.ipAddress = ctx?.ip || '0.0.0.0';

    const refreshTokenModel: RefreshTokenModel = AuthMapper.toRefreshTokenModel(
      createRefreshTokenDto,
      tokenHash,
      jti,
      expiresAt,
      new Date(),
    );

    await this.authRepository.storeRefreshToken(refreshTokenModel);

    await this.authRepository.logAccess(
      user.userId, 
      user.username, 
      'LOGIN',
      ctx?.ip || '0.0.0.0',
      ctx?.userAgent || 'N/A'
    );

    return AuthMapper.fromUserWithRolesAndPermissionsToUserResponse(
      user,
      refreshToken,
      accessToken,
    );
  }


}
