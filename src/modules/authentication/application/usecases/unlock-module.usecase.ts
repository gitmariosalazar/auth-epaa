import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { InterfaceUserRepository } from '../../../users/domain/contracts/user.interface.repository';
import { UnlockModuleRequest } from '../../domain/schemas/dto/request/unlock-module.request';
import { AuthDomainException } from '../../domain/exceptions/auth.exceptions';
import { validateFields } from '../../../../shared/validators/fields.validators';
import { environments } from '../../../../settings/environments/environments';
import { parseExpirationToSeconds } from '../../../../shared/utils/time.util';
import { AccessTokenPayload } from '../interfaces/user.payload';

@Injectable()
export class UnlockModuleUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: InterfaceUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(request: UnlockModuleRequest): Promise<{ elevated_token: string }> {
    const requiredFields: string[] = ['userId', 'pin'];
    const missingFieldsMessages: string[] = validateFields(request, requiredFields);

    if (missingFieldsMessages.length > 0) {
      throw new AuthDomainException(missingFieldsMessages.join(', '));
    }

    const user = await this.userRepository.findByIdWithRolesAndPermissions(request.userId);

    if (!user) {
      throw new AuthDomainException('User not found');
    }

    if (!user.pinSeguridadHash) {
      throw new AuthDomainException('El usuario no tiene un PIN de seguridad configurado');
    }

    const pinMatches = await bcrypt.compare(request.pin, user.pinSeguridadHash);

    if (!pinMatches) {
      throw new AuthDomainException('PIN de seguridad incorrecto');
    }

    const jtiForSend: string = crypto.randomUUID();
    const payload: AccessTokenPayload = {
      sub: user.userId,
      cliente_id: user.cardId,
      user_type: 'employee',
      username: user.username,
      email: user.email,
      roles: user.roles.map((role) => role.name),
      permissions: user.permissions.map((permission) => permission.id),
      jti: jtiForSend,
      module_special_unlocked: true,
    };

    // Use a short expiration for the elevated token or default JWT access expiration
    const elevatedToken = this.jwtService.sign(payload, {
      secret: environments.JWT_SECRET,
      expiresIn: parseExpirationToSeconds(environments.JWT_ACCESS_EXPIRATION),
      algorithm: 'HS256',
    });

    return { elevated_token: elevatedToken };
  }
}
