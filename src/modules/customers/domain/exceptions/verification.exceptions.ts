import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../settings/environments/status-code';

export class VerificationNotFoundException extends RpcException {
  constructor(clienteUsuarioId: string) {
    super({
      statusCode: statusCode.NOT_FOUND,
      message: `No se encontró una verificación activa pendiente para el usuario '${clienteUsuarioId}'.`,
    });
  }
}

export class VerificationCodeExpiredException extends RpcException {
  constructor() {
    super({
      statusCode: statusCode.BAD_REQUEST,
      message: 'El código de verificación ha expirado. Solicita uno nuevo.',
    });
  }
}

export class VerificationCodeInvalidException extends RpcException {
  constructor(intentosRestantes: number) {
    super({
      statusCode: statusCode.BAD_REQUEST,
      message: `Código incorrecto. Te quedan ${intentosRestantes} intento(s).`,
    });
  }
}

export class VerificationMaxAttemptsException extends RpcException {
  constructor() {
    super({
      statusCode: statusCode.BAD_REQUEST,
      message: 'Has excedido el número máximo de intentos. Solicita un nuevo código.',
    });
  }
}
