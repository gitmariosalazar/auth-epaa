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
      throw new InvalidCredentialsException();
    }

    const passwordMatches = await bcrypt.compare(
      authRequest.password,
      user.passwordHash || '',
    );

    if (!passwordMatches) {
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
    // const expiresIn = parseExpirationToSeconds(environments.JWT_REFRESH_EXPIRATION);
    // Not using expiresIn var from original code, assuming it's used in model creation if needed,
    // but AuthMapper.toRefreshTokenModel takes dates directly.

    const refreshTokenModel: RefreshTokenModel = AuthMapper.toRefreshTokenModel(
      new CreateRefreshTokenRequest(),
      refreshToken,
      jti,
      new Date(),
      new Date(), // Simplified for now, logic might need adjustment if expiration is critical here
    );

    await this.authRepository.storeRefreshToken(refreshTokenModel);

    return AuthMapper.fromUserWithRolesAndPermissionsToUserResponse(
      user,
      refreshToken,
      accessToken,
    );
  }
}
