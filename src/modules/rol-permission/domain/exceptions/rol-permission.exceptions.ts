export class RolPermissionDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RolPermissionDomainException';
  }
}

export class RolPermissionNotFoundException extends RolPermissionDomainException {
  constructor(identifier: string) {
    super(`RolPermission with identifier ${identifier} not found`);
    this.name = 'RolPermissionNotFoundException';
  }
}

export class RolPermissionAlreadyExistsException extends RolPermissionDomainException {
  constructor(identifier: string) {
    super(`RolPermission with identifier ${identifier} already exists`);
    this.name = 'RolPermissionAlreadyExistsException';
  }
}
