export class CategoryDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CategoryDomainException';
  }
}

export class CategoryNotFoundException extends CategoryDomainException {
  constructor(identifier: string) {
    super(`Category with identifier ${identifier} not found`);
    this.name = 'CategoryNotFoundException';
  }
}

export class CategoryAlreadyExistsException extends CategoryDomainException {
  constructor(identifier: string) {
    super(`Category with identifier ${identifier} already exists`);
    this.name = 'CategoryAlreadyExistsException';
  }
}
