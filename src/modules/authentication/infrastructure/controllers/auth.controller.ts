import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthRequest } from '../../domain/schemas/dto/request/auth.request';
import { LoginUseCase } from '../../application/usecases/login.usecase';
import { AuthDomainException } from '../../domain/exceptions/auth.exceptions';
import { statusCode } from '../../../../settings/environments/status-code';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

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
}
