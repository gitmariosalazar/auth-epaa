import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthRequest } from '../../domain/schemas/dto/request/auth.request';
import { LoginUseCase } from '../../application/usecases/login.usecase';
import { LogoutUseCase } from '../../application/usecases/logout.usecase';
import { RefreshTokenUseCase } from '../../application/usecases/refresh-token.usecase';
import { AuthDomainException } from '../../domain/exceptions/auth.exceptions';
import { statusCode } from '../../../../settings/environments/status-code';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
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
}

