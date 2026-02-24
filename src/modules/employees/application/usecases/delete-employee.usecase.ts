import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserEmployeeRepository } from '../../domain/contracts/user-employee.interface.repository';
import {
  EmployeeDomainException,
  EmployeeNotFoundException,
} from '../../domain/exceptions/employee.exceptions';

@Injectable()
export class DeleteEmployeeUseCase {
  constructor(
    @Inject('UserEmployeeRepository')
    private readonly userEmployeeRepository: InterfaceUserEmployeeRepository,
  ) {}

  async execute(employeeId: string): Promise<void> {
    if (!employeeId)
      throw new EmployeeDomainException('Employee ID is required');
    const existing = await this.userEmployeeRepository.findById(employeeId);
    if (!existing) throw new EmployeeNotFoundException(employeeId);
    await this.userEmployeeRepository.softDelete(employeeId);
  }
}
