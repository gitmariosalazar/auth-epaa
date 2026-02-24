export class PermissionDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionDomainException';
  }
}

export class PermissionNotFoundException extends PermissionDomainException {
  constructor(identifier: string) {
    super(`Permission with identifier ${identifier} not found`);
    this.name = 'PermissionNotFoundException';
  }
}

export class PermissionAlreadyExistsException extends PermissionDomainException {
  constructor(identifier: string) {
    super(`Permission with identifier ${identifier} already exists`);
    this.name = 'PermissionAlreadyExistsException';
  }
}

export class CategoryWithPermissionsNotFoundException extends PermissionDomainException {
  constructor(identifier: number) {
    super(`Category with identifier ${identifier} not found`);
    this.name = 'CategoryWithPermissionsNotFoundException';
  }
}
