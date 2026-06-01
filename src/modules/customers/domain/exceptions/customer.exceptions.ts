import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../settings/environments/status-code';

export class CustomerDomainException extends RpcException {
  constructor(message: string) {
    super({
      statusCode: statusCode.BAD_REQUEST,
      message: `Customer domain violation: ${message}`,
    });
  }
}

export class CustomerAlreadyExistsException extends RpcException {
  constructor(identifier: string) {
    super({
      statusCode: statusCode.CONFLICT,
      message: `Customer with identifier '${identifier}' already exists`,
    });
  }
}

export class CustomerNotFoundException extends RpcException {
  constructor(identifier: string) {
    super({
      statusCode: statusCode.NOT_FOUND,
      message: `Customer with identifier '${identifier}' not found`,
    });
  }
}
