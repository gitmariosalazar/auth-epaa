import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InterfaceUserRepository } from '../../domain/contracts/user.interface.repository';
import { SetPinRequest } from '../../domain/schemas/dto/request/set-pin.request';
import { AuthDomainException } from '../../../authentication/domain/exceptions/auth.exceptions';
import { validateFields } from '../../../../shared/validators/fields.validators';

@Injectable()
export class SetPinUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: InterfaceUserRepository,
  ) {}

  async execute(
    request: SetPinRequest,
  ): Promise<{ success: boolean; message: string }> {
    const requiredFields: string[] = ['userId', 'pin'];
    const missingFieldsMessages: string[] = validateFields(
      request,
      requiredFields,
    );

    if (missingFieldsMessages.length > 0) {
      throw new AuthDomainException(missingFieldsMessages.join(', '));
    }

    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new AuthDomainException('User not found');
    }

    // Hasheamos el PIN
    const hashedPin = await bcrypt.hash(request.pin, 10);

    // Guardamos el PIN en la BD
    await this.userRepository.setPin(request.userId, hashedPin);

    return { success: true, message: 'PIN configurado correctamente' };
  }
}
