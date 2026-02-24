import { Inject, Injectable } from '@nestjs/common';
import { InterfaceAuthRepository } from '../../domain/contracts/auth.interface.repository';
import { AuthDomainException } from '../../domain/exceptions/auth.exceptions';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject('AuthRepository')
    private readonly authRepository: InterfaceAuthRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    // Logic to be implemented or migrated
    throw new AuthDomainException('Method not implemented.');
  }
}
