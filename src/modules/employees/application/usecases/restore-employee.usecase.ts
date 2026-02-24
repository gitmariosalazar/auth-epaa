import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserEmployeeRepository } from '../../domain/contracts/user-employee.interface.repository';
import { UserEmployeeResponse } from '../../domain/schemas/dto/response/user-employee.response';
import { EmployeeDomainException } from '../../domain/exceptions/employee.exceptions';

@Injectable()
export class RestoreEmployeeUseCase {
  constructor(
    @Inject('UserEmployeeRepository')
    private readonly userEmployeeRepository: InterfaceUserEmployeeRepository,
  ) {}

  async execute(employeeId: string): Promise<UserEmployeeResponse> {
    if (!employeeId)
      throw new EmployeeDomainException('Employee ID is required');
    const restored = await this.userEmployeeRepository.restore(employeeId);
    if (!restored)
      throw new EmployeeDomainException('Failed to restore employee');
    return restored;
  }
}
