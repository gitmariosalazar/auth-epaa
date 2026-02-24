import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserEmployeeRepository } from '../../domain/contracts/user-employee.interface.repository';
import {
  EmployeeDomainException,
  EmployeeNotFoundException,
} from '../../domain/exceptions/employee.exceptions';

@Injectable()
export class AssignEmployeeZonesUseCase {
  constructor(
    @Inject('UserEmployeeRepository')
    private readonly userEmployeeRepository: InterfaceUserEmployeeRepository,
  ) {}

  async execute(employeeId: string, zoneIds: number[]): Promise<void> {
    if (!employeeId)
      throw new EmployeeDomainException('Employee ID is required');
    if (!zoneIds || !Array.isArray(zoneIds))
      throw new EmployeeDomainException('Zone IDs must be an array');

    const existing = await this.userEmployeeRepository.findById(employeeId);
    if (!existing) throw new EmployeeNotFoundException(employeeId);

    await this.userEmployeeRepository.assignZones(employeeId, zoneIds);
  }
}
