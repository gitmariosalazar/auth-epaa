import { CreateUserRequest } from '../../domain/schemas/dto/request/create.user.request';
import { UserResponse } from '../../domain/schemas/dto/response/user.response';
import { UserModel } from '../../domain/schemas/models/user.model';

export class UserMapper {
  static fromCreateUserRequestToUserModel(
    request: CreateUserRequest,
    hashedPassword: string,
  ): UserModel {
    return new UserModel(
      '', // UserID will be assigned by the database
      request.username,
      hashedPassword,
      request.email,
      new Date(),
      null,
      0,
      false,
      true,
      null,
    );
  }

  static fromUpdateUserRequestToUserModel(
    userId: string,
    updates: CreateUserRequest,
    existingUser: UserModel,
  ): UserModel {
    const updatedUser = new UserModel(
      existingUser.getUserId() || userId.toString(),
      updates.username || existingUser.getUsername(),
      existingUser.getPasswordHash(),
      updates.email || existingUser.getEmail(),
      existingUser.getRegistrationDate(),
      existingUser.getLastLogin(),
      existingUser.getFailedAttempts(),
      existingUser.isTwoFactorEnabled(),
      existingUser.getIsActive(),
      existingUser.getObservations(),
    );
    return updatedUser;
  }

  static fromUserModelToUserResponse(user: UserModel): UserResponse {
    return {
      userId: user.getUserId(),
      username: user.getUsername(),
      email: user.getEmail(),
      registeredAt: user.getRegistrationDate(),
      lastLogin: user.getLastLogin(),
      failedAttempts: user.getFailedAttempts(),
      twoFactorEnabled: user.isTwoFactorEnabled(),
      isActive: user.getIsActive(),
      observations: user.getObservations(),
    };
  }

  static fromUserResponseToUserModel(user: UserResponse): UserModel {
    return new UserModel(
      user.userId,
      user.username,
      '', // Password hash is not included in the response
      user.email,
      user.registeredAt,
      user.lastLogin || null,
      user.failedAttempts || 0,
      user.twoFactorEnabled || false,
      user.isActive,
      user.observations || null,
    );
  }
}
