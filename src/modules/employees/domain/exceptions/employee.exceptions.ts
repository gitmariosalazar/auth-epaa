export class EmployeeDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmployeeDomainException';
  }
}

export class EmployeeNotFoundException extends EmployeeDomainException {
  constructor(identifier: string) {
    super(`Employee with identifier ${identifier} not found`);
    this.name = 'EmployeeNotFoundException';
  }
}

export class EmployeeAlreadyExistsException extends EmployeeDomainException {
  constructor(identifier: string) {
    super(`Employee with identifier ${identifier} already exists`);
    this.name = 'EmployeeAlreadyExistsException';
  }
}
