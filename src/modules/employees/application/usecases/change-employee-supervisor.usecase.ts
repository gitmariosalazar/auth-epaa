import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserEmployeeRepository } from '../../domain/contracts/user-employee.interface.repository';
import { UserEmployeeResponse } from '../../domain/schemas/dto/response/user-employee.response';
import {
  EmployeeDomainException,
  EmployeeNotFoundException,
} from '../../domain/exceptions/employee.exceptions';

@Injectable()
export class ChangeEmployeeSupervisorUseCase {
  constructor(
    @Inject('UserEmployeeRepository')
    private readonly userEmployeeRepository: InterfaceUserEmployeeRepository,
  ) {}

  async execute(
    employeeId: string,
    supervisorId: string | null,
  ): Promise<UserEmployeeResponse> {
    if (!employeeId)
      throw new EmployeeDomainException('Employee ID is required');

    const existing = await this.userEmployeeRepository.findById(employeeId);
    if (!existing) throw new EmployeeNotFoundException(employeeId);

    const updated = await this.userEmployeeRepository.changeSupervisor(
      employeeId,
      supervisorId,
    );
    if (!updated)
      throw new EmployeeDomainException('Failed to change supervisor');
    return updated;
  }
}
