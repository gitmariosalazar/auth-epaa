import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserRepository } from '../../domain/contracts/user.interface.repository';
import {
  UserResponse,
  UserResponseWithRolesAndPermissionsResponse,
} from '../../domain/schemas/dto/response/user.response';
import {
  UserNotFoundException,
  UserDomainException,
} from '../../domain/exceptions/user.exceptions';

@Injectable()
export class FindUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: InterfaceUserRepository,
  ) {}

  async findById(userId: string): Promise<UserResponse> {
    if (!userId) throw new UserDomainException('User ID is required');
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException(userId);
    return user;
  }

  async findByUsername(username: string): Promise<UserResponse> {
    if (!username) throw new UserDomainException('Username is required');
    const user = await this.userRepository.findByUsername(username);
    if (!user) throw new UserNotFoundException(username);
    return user;
  }

  async findByEmail(email: string): Promise<UserResponse> {
    if (!email) throw new UserDomainException('Email is required');
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UserNotFoundException(email);
    return user;
  }

  async findByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<UserResponse> {
    if (!username && !email)
      throw new UserDomainException('Username or Email is required');
    const user = await this.userRepository.findByUsernameOrEmail(
      username,
      email,
    );
    if (!user) throw new UserNotFoundException(`${username} or ${email}`);
    return user;
  }

  async findByUsernameOrEmailWithRoles(
    usernameOrEmail: string,
  ): Promise<UserResponseWithRolesAndPermissionsResponse> {
    if (!usernameOrEmail)
      throw new UserDomainException('Username or Email is required');
    const user =
      await this.userRepository.findByUsernameOrEmailWithRolesAndPermissions(
        usernameOrEmail,
      );
    if (!user) throw new UserNotFoundException(usernameOrEmail);
    return user;
  }

  async findAll(
    limit: number,
    offset: number,
  ): Promise<UserResponseWithRolesAndPermissionsResponse[]> {
    if (limit < 0 || offset < 0)
      throw new UserDomainException('Limit and offset must be positive');
    return await this.userRepository.findAllUsers(limit, offset);
  }

  async existsByUsername(username: string): Promise<boolean> {
    if (!username) throw new UserDomainException('Username is required');
    return await this.userRepository.existsByUsername(username);
  }

  async findByRefreshToken(token: string): Promise<UserResponse> {
    if (!token) throw new UserDomainException('Refresh token is required');
    const user = await this.userRepository.findByRefreshToken(token);
    if (!user) throw new UserNotFoundException('token');
    return user;
  }

  async existsByEmail(email: string): Promise<boolean> {
    if (!email) throw new UserDomainException('Email is required');
    return await this.userRepository.existsByEmail(email);
  }

  async existsByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<boolean> {
    if (!username && !email)
      throw new UserDomainException('Username or Email is required');
    return await this.userRepository.existsByUsernameOrEmail(username, email);
  }

  async getProfile(
    usernameOrEmail: string,
  ): Promise<UserResponseWithRolesAndPermissionsResponse> {
    if (!usernameOrEmail)
      throw new UserDomainException('Username or Email is required');
    const user =
      await this.userRepository.findByUsernameOrEmailWithRolesAndPermissions(
        usernameOrEmail,
      );
    if (!user) throw new UserNotFoundException(usernameOrEmail);
    return user;
  }
}
