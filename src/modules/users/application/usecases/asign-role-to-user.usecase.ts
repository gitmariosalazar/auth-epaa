import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserRepository } from '../../domain/contracts/user.interface.repository';
import {
  AssignRoleToUserRequest,
  RemoveRoleFromUserRequest,
} from '../../domain/schemas/dto/request/assign-role-to-user.request';
import {
  RoleNotFoundException,
  UserDomainException,
  UserNotFoundException,
} from '../../domain/exceptions/user.exceptions';
import {
  UserResponse,
  UserResponseWithRolesResponse,
} from '../../domain/schemas/dto/response/user.response';
import { InterfaceRolRepository } from '../../../roles/domain/contracts/rol.interface.repository';

@Injectable()
export class AssignRoleToUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: InterfaceUserRepository,
    @Inject('RolRepository')
    private readonly roleRepository: InterfaceRolRepository,
  ) {}

  async assignRoleToUser(
    assignRoleToUserRequest: AssignRoleToUserRequest,
  ): Promise<boolean> {
    if (!assignRoleToUserRequest.userId || !assignRoleToUserRequest.roleId) {
      throw new UserDomainException('User ID and Role ID are required');
    }
    const user = await this.userRepository.findById(
      assignRoleToUserRequest.userId,
    );
    if (!user) throw new UserNotFoundException(assignRoleToUserRequest.userId);
    const role = await this.roleRepository.getRolById(
      assignRoleToUserRequest.roleId,
    );
    if (!role)
      throw new RoleNotFoundException(
        assignRoleToUserRequest.roleId.toString(),
      );

    const existsRoleInUser = await this.userRepository.existsRoleInUser(
      assignRoleToUserRequest.userId,
      assignRoleToUserRequest.roleId,
    );
    if (existsRoleInUser)
      throw new UserDomainException('User already has this role');
    return await this.userRepository.assignRoleToUser(assignRoleToUserRequest);
  }

  async removeRoleFromUser(
    removeRoleFromUserRequest: RemoveRoleFromUserRequest,
  ): Promise<boolean> {
    if (
      !removeRoleFromUserRequest.userId ||
      !removeRoleFromUserRequest.roleId
    ) {
      throw new UserDomainException('User ID and Role ID are required');
    }
    const user = await this.userRepository.findById(
      removeRoleFromUserRequest.userId,
    );
    if (!user)
      throw new UserNotFoundException(removeRoleFromUserRequest.userId);
    const role = await this.roleRepository.getRolById(
      removeRoleFromUserRequest.roleId,
    );
    if (!role)
      throw new RoleNotFoundException(
        removeRoleFromUserRequest.roleId.toString(),
      );
    return await this.userRepository.removeRoleFromUser(
      removeRoleFromUserRequest,
    );
  }

  async existsRoleInUser(userId: string, roleId: number): Promise<boolean> {
    if (!userId || !roleId) {
      throw new UserDomainException('User ID and Role ID are required');
    }
    return await this.userRepository.existsRoleInUser(userId, roleId);
  }

  async getUsersByRoleId(roleId: number): Promise<UserResponse[]> {
    if (!roleId) {
      throw new UserDomainException('Role ID is required');
    }
    return await this.userRepository.getUsersByRoleId(roleId);
  }

  async getRolesByUserId(
    userId: string,
  ): Promise<UserResponseWithRolesResponse[]> {
    if (!userId) {
      throw new UserDomainException('User ID is required');
    }
    return await this.userRepository.getRolesByUserId(userId);
  }
}
