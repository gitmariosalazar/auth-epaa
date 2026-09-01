import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthRequest } from '../../domain/schemas/dto/request/auth.request';
import { VerifyUserRequest } from '../../domain/schemas/dto/request/verify-user.request';
import { LoginUseCase } from '../../application/usecases/login.usecase';
import { LogoutUseCase } from '../../application/usecases/logout.usecase';
import { RefreshTokenUseCase } from '../../application/usecases/refresh-token.usecase';
import { VerifyUserUseCase } from '../../application/usecases/verify-user.usecase';
import { ClientLoginUseCase } from '../../application/usecases/client-login.usecase';
import { UnlockModuleUseCase } from '../../application/usecases/unlock-module.usecase';
import { ClientAuthRequest } from '../../domain/schemas/dto/request/client-auth.request';
import { UnlockModuleRequest } from '../../domain/schemas/dto/request/unlock-module.request';
import { AuthDomainException } from '../../domain/exceptions/auth.exceptions';
import { statusCode } from '../../../../settings/environments/status-code';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly verifyUserUseCase: VerifyUserUseCase,
    private readonly clientLoginUseCase: ClientLoginUseCase,
    private readonly unlockModuleUseCase: UnlockModuleUseCase,
  ) {}


  private handleException(error: any): never {
    if (error instanceof AuthDomainException) {
      throw new RpcException({
        statusCode: statusCode.UNAUTHORIZED, // Default to unauthorized for auth errors
        message: error.message,
      });
    }
    if (error instanceof RpcException) throw error;

    throw new RpcException({
      statusCode: statusCode.INTERNAL_SERVER_ERROR,
      message: error.message || 'Internal server error',
    });
  }

  @MessagePattern('authentication.auth.signin')
  async authenticateUser(@Payload() payload: AuthRequest) {
    try {
      return await this.loginUseCase.execute(payload);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.auth.client.signin')
  async authenticateClient(@Payload() payload: ClientAuthRequest) {
    try {
      return await this.clientLoginUseCase.execute(payload);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.auth.signout')
  async signOut(@Payload() payload: { userId: string; refreshToken?: string }) {
    try {
      const userId = typeof payload === 'string' ? payload : payload.userId;
      const refreshToken = typeof payload === 'object' ? payload.refreshToken : undefined;
      return await this.logoutUseCase.execute(userId, refreshToken);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.auth.refresh')
  async refreshToken(@Payload() payload: { refreshToken: string }) {
    try {
      return await this.refreshTokenUseCase.execute(payload);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.auth.verify')
  async verifyUser(@Payload() payload: VerifyUserRequest) {
    try {
      return await this.verifyUserUseCase.execute(payload);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.auth.unlock-module')
  async authenticateUnlockModule(@Payload() payload: UnlockModuleRequest) {
    try {
      return await this.unlockModuleUseCase.execute(payload);
    } catch (error) {
      this.handleException(error);
    }
  }
}

