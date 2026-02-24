import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserRepository } from '../../../users/domain/contracts/user.interface.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: InterfaceUserRepository,
  ) {}

  async execute(usernameOrEmail: string, pass: string): Promise<any> {
    const user =
      await this.userRepository.findByUsernameOrEmailWithRolesAndPermissions(
        usernameOrEmail,
      );
    if (user && (await bcrypt.compare(pass, user.passwordHash || ''))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }
}
