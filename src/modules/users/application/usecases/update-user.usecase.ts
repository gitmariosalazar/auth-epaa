import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserRepository } from '../../domain/contracts/user.interface.repository';
import { UserResponse } from '../../domain/schemas/dto/response/user.response';
import {
  UserDomainException,
  UserNotFoundException,
} from '../../domain/exceptions/user.exceptions';
import { UpdateUserRequest } from '../../domain/schemas/dto/request/update.user.request';
import { validateFields } from '../../../../shared/validators/fields.validators';
import { UserModel } from '../../domain/schemas/models/user.model';
import { UserMapper } from '../mappers/user.mapper';
// Note: We need existing FindUserUseCase to verify existence or repeat logic?
// Ideally avoid circular deps. We can just use the repository.

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: InterfaceUserRepository,
  ) {}

  async updateUser(
    userId: string,
    updates: Partial<UpdateUserRequest>,
  ): Promise<UserResponse> {
    if (!userId) throw new UserDomainException('User ID is required');

    const existingUserResponse = await this.userRepository.findById(userId);
    if (!existingUserResponse) throw new UserNotFoundException(userId);

    const existingUserModel =
      UserMapper.fromUserResponseToUserModel(existingUserResponse);
    const updatedUserModel = UserMapper.fromUpdateUserRequestToUserModel(
      userId,
      updates as any,
      existingUserModel,
    );

    // Check unique constraints if username/email changed
    // This logic was in the original service
    if (
      updates.username &&
      updates.username !== existingUserResponse.username
    ) {
      const exists = await this.userRepository.existsByUsername(
        updates.username,
      );
      if (exists)
        throw new UserDomainException(
          `Username ${updates.username} is already taken`,
        );
    }
    if (updates.email && updates.email !== existingUserResponse.email) {
      const exists = await this.userRepository.existsByEmail(updates.email);
      if (exists)
        throw new UserDomainException(
          `Email ${updates.email} is already registered`,
        );
    }

    const result = await this.userRepository.updateUser(
      userId,
      updatedUserModel,
    );
    if (!result) throw new UserDomainException('Failed to update user');
    return result;
  }

  async softDelete(userId: string): Promise<void> {
    if (!userId) throw new UserDomainException('User ID is required');
    const exists = await this.userRepository.findById(userId);
    if (!exists) throw new UserNotFoundException(userId);
    await this.userRepository.softDelete(userId);
  }

  async restore(userId: string): Promise<UserResponse> {
    if (!userId) throw new UserDomainException('User ID is required');
    const restored = await this.userRepository.restore(userId);
    if (!restored) throw new UserDomainException('Failed to restore user'); // Or Not Found
    return restored;
  }

  async incrementFailedAttempts(userId: string): Promise<void> {
    if (!userId) throw new UserDomainException('User ID is required');
    // Verify existence? Original did.
    const exists = await this.userRepository.findById(userId);
    if (!exists) throw new UserNotFoundException(userId);
    await this.userRepository.incrementFailedAttempts(userId);
  }

  async resetFailedAttempts(userId: string): Promise<void> {
    if (!userId) throw new UserDomainException('User ID is required');
    const exists = await this.userRepository.findById(userId);
    if (!exists) throw new UserNotFoundException(userId);
    await this.userRepository.resetFailedAttempts(userId);
  }
}
