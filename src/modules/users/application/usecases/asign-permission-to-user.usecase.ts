import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserRepository } from '../../domain/contracts/user.interface.repository';
import {
  AssignPermissionToUserRequest,
  RemovePermissionFromUserRequest,
} from '../../domain/schemas/dto/request/assign-permission-to-user.request';
import {
  UserDomainException,
  UserNotFoundException,
} from '../../domain/exceptions/user.exceptions';
import {
  UserResponse,
  UserResponseWithPermissionsResponse,
} from '../../domain/schemas/dto/response/user.response';
import { InterfacePermissionRepository } from '../../../permissions/domain/contracts/permission.interface.repository';
import { PermissionNotFoundException } from '../../../permissions/domain/exceptions/permission.exceptions';

@Injectable()
export class AssignPermissionToUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: InterfaceUserRepository,
    @Inject('PermissionRepository')
    private readonly permissionRepository: InterfacePermissionRepository,
  ) {}

  async assignPermissionToUser(
    assignPermissionToUserRequest: AssignPermissionToUserRequest,
  ): Promise<boolean> {
    if (
      !assignPermissionToUserRequest.userId ||
      !assignPermissionToUserRequest.permissionId
    ) {
      throw new UserDomainException('User ID and Permission ID are required');
    }
    const user = await this.userRepository.findById(
      assignPermissionToUserRequest.userId,
    );
    if (!user)
      throw new UserNotFoundException(assignPermissionToUserRequest.userId);
    const permission = await this.permissionRepository.getPermissionById(
      assignPermissionToUserRequest.permissionId,
    );
    if (!permission)
      throw new PermissionNotFoundException(
        assignPermissionToUserRequest.permissionId.toString(),
      );
    const existsPermissionInUser =
      await this.userRepository.existsPermissionInUser(
        assignPermissionToUserRequest.userId,
        assignPermissionToUserRequest.permissionId,
      );
    if (existsPermissionInUser)
      throw new UserDomainException('User already has this permission');
    return await this.userRepository.assignPermissionToUser(
      assignPermissionToUserRequest,
    );
  }

  async removePermissionFromUser(
    removePermissionFromUserRequest: RemovePermissionFromUserRequest,
  ): Promise<boolean> {
    if (
      !removePermissionFromUserRequest.userId ||
      !removePermissionFromUserRequest.permissionId
    ) {
      throw new UserDomainException('User ID and Permission ID are required');
    }
    const user = await this.userRepository.findById(
      removePermissionFromUserRequest.userId,
    );
    if (!user)
      throw new UserNotFoundException(removePermissionFromUserRequest.userId);
    const permission = await this.permissionRepository.getPermissionById(
      removePermissionFromUserRequest.permissionId,
    );
    if (!permission)
      throw new PermissionNotFoundException(
        removePermissionFromUserRequest.permissionId.toString(),
      );
    return await this.userRepository.removePermissionFromUser(
      removePermissionFromUserRequest,
    );
  }

  async existsPermissionInUser(
    userId: string,
    permissionId: number,
  ): Promise<boolean> {
    if (!userId || !permissionId) {
      throw new UserDomainException('User ID and Permission ID are required');
    }
    return await this.userRepository.existsPermissionInUser(
      userId,
      permissionId,
    );
  }

  async getUsersByPermissionId(permissionId: number): Promise<UserResponse[]> {
    if (!permissionId) {
      throw new UserDomainException('Permission ID is required');
    }
    return await this.userRepository.getUsersByPermissionId(permissionId);
  }

  async getPermissionsByUserId(
    userId: string,
  ): Promise<UserResponseWithPermissionsResponse[]> {
    if (!userId) {
      throw new UserDomainException('User ID is required');
    }
    return await this.userRepository.getPermissionsByUserId(userId);
  }
}
