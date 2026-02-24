import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserEmployeeRepository } from '../../domain/contracts/user-employee.interface.repository';
import { UserEmployeeResponse } from '../../domain/schemas/dto/response/user-employee.response';
import {
  EmployeeDomainException,
  EmployeeNotFoundException,
} from '../../domain/exceptions/employee.exceptions';

@Injectable()
export class ChangeEmployeeStatusUseCase {
  constructor(
    @Inject('UserEmployeeRepository')
    private readonly userEmployeeRepository: InterfaceUserEmployeeRepository,
  ) {}

  async execute(
    employeeId: string,
    newStatusId: number,
  ): Promise<UserEmployeeResponse> {
    if (!employeeId)
      throw new EmployeeDomainException('Employee ID is required');

    const existing = await this.userEmployeeRepository.findById(employeeId);
    if (!existing) throw new EmployeeNotFoundException(employeeId);

    const updated = await this.userEmployeeRepository.changeStatus(
      employeeId,
      newStatusId,
    );
    if (!updated) throw new EmployeeDomainException('Failed to change status');
    return updated;
  }
}
