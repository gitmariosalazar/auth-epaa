export class UserDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserDomainException';
  }
}

export class UserNotFoundException extends UserDomainException {
  constructor(identifier: string) {
    super(`User with identifier ${identifier} not found`);
    this.name = 'UserNotFoundException';
  }
}

export class UserAlreadyExistsException extends UserDomainException {
  constructor(identifier: string) {
    super(`User with identifier ${identifier} already exists`);
    this.name = 'UserAlreadyExistsException';
  }
}

export class InvalidCredentialsException extends UserDomainException {
  constructor() {
    super('Invalid credentials');
    this.name = 'InvalidCredentialsException';
  }
}

export class InvalidPasswordException extends UserDomainException {
  constructor(message: string = 'Invalid password') {
    super(message);
    this.name = 'InvalidPasswordException';
  }
}

export class RoleNotFoundException extends UserDomainException {
  constructor(identifier: string) {
    super(`Role with identifier ${identifier} not found`);
    this.name = 'RoleNotFoundException';
  }
}
