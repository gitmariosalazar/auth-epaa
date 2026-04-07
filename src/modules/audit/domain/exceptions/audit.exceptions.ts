import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../settings/environments/status-code';

export class AuditDomainException extends RpcException {
  constructor(message: string) {
    super({
      statusCode: statusCode.BAD_REQUEST,
      message,
    });
  }
}

export class AuditNotFoundException extends RpcException {
  constructor(resource: string) {
    super({
      statusCode: statusCode.NOT_FOUND,
      message: `Audit resource not found for: ${resource}`,
    });
  }
}
