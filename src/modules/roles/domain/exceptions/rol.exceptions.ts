export class RolDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RolDomainException';
  }
}

export class RolNotFoundException extends RolDomainException {
  constructor(identifier: string) {
    super(`Rol with identifier ${identifier} not found`);
    this.name = 'RolNotFoundException';
  }
}

export class RolAlreadyExistsException extends RolDomainException {
  constructor(identifier: string) {
    super(`Rol with identifier ${identifier} already exists`);
    this.name = 'RolAlreadyExistsException';
  }
}
