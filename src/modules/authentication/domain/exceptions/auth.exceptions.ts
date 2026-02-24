export class AuthDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthDomainException';
  }
}

export class InvalidCredentialsException extends AuthDomainException {
  constructor() {
    super('Invalid credentials. Please try again!');
    this.name = 'InvalidCredentialsException';
  }
}

export class TokenExpiredException extends AuthDomainException {
  constructor() {
    super('Token has expired');
    this.name = 'TokenExpiredException';
  }
}

export class AccountLockedException extends AuthDomainException {
  constructor(message: string) {
    super(message);
    this.name = 'AccountLockedException';
  }
}
