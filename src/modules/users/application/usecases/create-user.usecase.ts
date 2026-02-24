import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserRepository } from '../../domain/contracts/user.interface.repository';
import { IEncryptionService } from '../../domain/adapters/encryption.service.interface';
import { CreateUserRequest } from '../../domain/schemas/dto/request/create.user.request';
import { UserResponse } from '../../domain/schemas/dto/response/user.response';
import {
  UserAlreadyExistsException,
  UserDomainException,
} from '../../domain/exceptions/user.exceptions';
import { UserMapper } from '../mappers/user.mapper';
import { validateFields } from '../../../../shared/validators/fields.validators';
import { UserModel } from '../../domain/schemas/models/user.model';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: InterfaceUserRepository,
    @Inject('EncryptionService')
    private readonly encryptionService: IEncryptionService,
  ) {}

  async execute(request: CreateUserRequest): Promise<UserResponse> {
    const requiredFields = ['username', 'email', 'password', 'confirmPassword'];
    const missingFieldsMessages = validateFields(request, requiredFields);

    if (missingFieldsMessages.length > 0) {
      throw new UserDomainException(missingFieldsMessages.join(', '));
    }

    if (request.password !== request.confirmPassword) {
      throw new UserDomainException(
        'Password and confirm password do not match',
      );
    }

    const existsUsername = await this.userRepository.existsByUsername(
      request.username,
    );
    if (existsUsername) {
      throw new UserAlreadyExistsException(request.username);
    }

    const existsEmail = await this.userRepository.existsByEmail(request.email);
    if (existsEmail) {
      throw new UserAlreadyExistsException(request.email);
    }

    const hashedPassword = await this.encryptionService.hash(request.password);
    const userModel: UserModel = UserMapper.fromCreateUserRequestToUserModel(
      request,
      hashedPassword,
    );

    const createdUser = await this.userRepository.createUser(userModel);

    if (!createdUser) {
      throw new UserDomainException('Failed to create user');
    }

    return createdUser;
  }
}
