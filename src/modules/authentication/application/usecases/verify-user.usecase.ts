import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserRepository } from '../../../users/domain/contracts/user.interface.repository';
import { VerifyUserRequest } from '../../domain/schemas/dto/request/verify-user.request';
import { VerifyUserResponse } from '../../domain/schemas/dto/response/verify-user.response';
import { validateFields } from '../../../../shared/validators/fields.validators';
import {
  AuthDomainException,
  UserNotFoundException,
} from '../../domain/exceptions/auth.exceptions';

/**
 * VerifyUserUseCase
 *
 * Single Responsibility : checks only whether a user exists — no password logic.
 * Open/Closed           : new verification rules can be added without touching Login.
 * Dependency Inversion  : depends on InterfaceUserRepository abstraction, not a concrete class.
 */
@Injectable()
export class VerifyUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: InterfaceUserRepository,
  ) {}

  async execute(request: VerifyUserRequest): Promise<VerifyUserResponse> {
    const requiredFields: string[] = ['username_or_email'];
    const missingFieldsMessages: string[] = validateFields(
      request,
      requiredFields,
    );

    if (missingFieldsMessages.length > 0) {
      throw new AuthDomainException(missingFieldsMessages.join(', '));
    }

    const user =
      await this.userRepository.findByUsernameOrEmailWithRolesAndPermissions(
        request.username_or_email,
      );

    if (!user) {
      throw new UserNotFoundException(request.username_or_email);
    }

    return {
      exists: true,
      userId: user.userId,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
    };
  }
}
