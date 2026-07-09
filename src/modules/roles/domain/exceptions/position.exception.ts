export class PositionDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PositionDomainException';
  }
}

export class PositionNotFoundException extends PositionDomainException {
  constructor(identifier: string) {
    super(`Position with identifier ${identifier} not found`);
    this.name = 'PositionNotFoundException';
  }
}

export class PositionAlreadyExistsException extends PositionDomainException {
  constructor(identifier: string) {
    super(`Position with identifier ${identifier} already exists`);
    this.name = 'PositionAlreadyExistsException';
  }
}
