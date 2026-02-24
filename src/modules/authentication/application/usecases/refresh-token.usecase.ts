import { Inject, Injectable } from '@nestjs/common';
import { InterfaceAuthRepository } from '../../domain/contracts/auth.interface.repository';
import { RefreshTokenRequest } from '../../domain/schemas/dto/request/refresh-token.request';
import { AuthResponse } from '../../domain/schemas/dto/response/auth.response';
import { AuthDomainException } from '../../domain/exceptions/auth.exceptions';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('AuthRepository')
    private readonly authRepository: InterfaceAuthRepository,
  ) {}

  async execute(request: RefreshTokenRequest): Promise<AuthResponse> {
    // Logic to be implemented or migrated
    throw new AuthDomainException('Method not implemented.');
  }
}
