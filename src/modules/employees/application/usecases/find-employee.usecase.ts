import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserEmployeeRepository } from '../../domain/contracts/user-employee.interface.repository';
import { UserEmployeeResponse } from '../../domain/schemas/dto/response/user-employee.response';
import {
  EmployeeDomainException,
  EmployeeNotFoundException,
} from '../../domain/exceptions/employee.exceptions';

@Injectable()
export class FindEmployeeUseCase {
  constructor(
    @Inject('UserEmployeeRepository')
    private readonly userEmployeeRepository: InterfaceUserEmployeeRepository,
  ) {}

  async findById(employeeId: string): Promise<UserEmployeeResponse> {
    if (!employeeId)
      throw new EmployeeDomainException('Employee ID is required');
    const result = await this.userEmployeeRepository.findById(employeeId);
    if (!result) throw new EmployeeNotFoundException(employeeId);
    return result;
  }

  async findByUserId(userId: string): Promise<UserEmployeeResponse> {
    if (!userId) throw new EmployeeDomainException('User ID is required');
    const result = await this.userEmployeeRepository.findByUserId(userId);
    if (!result) throw new EmployeeNotFoundException(`User ID ${userId}`);
    return result;
  }

  async findByIdCard(idCard: string): Promise<UserEmployeeResponse> {
    if (!idCard) throw new EmployeeDomainException('ID Card is required');
    const result = await this.userEmployeeRepository.findByIdCard(idCard);
    if (!result) throw new EmployeeNotFoundException(`ID Card ${idCard}`);
    return result;
  }

  async searchByName(searchTerm: string): Promise<UserEmployeeResponse[]> {
    if (!searchTerm)
      throw new EmployeeDomainException('Search term is required');
    return await this.userEmployeeRepository.searchByName(searchTerm);
  }

  async findAllActive(): Promise<UserEmployeeResponse[]> {
    return await this.userEmployeeRepository.findAllActive();
  }

  async findByPosition(positionId: number): Promise<UserEmployeeResponse[]> {
    if (!positionId)
      throw new EmployeeDomainException('Position ID is required');
    return await this.userEmployeeRepository.findByPosition(positionId);
  }

  async findByZone(zoneId: number): Promise<UserEmployeeResponse[]> {
    if (!zoneId) throw new EmployeeDomainException('Zone ID is required');
    return await this.userEmployeeRepository.findByZone(zoneId);
  }

  async findBySupervisor(
    supervisorId: string,
  ): Promise<UserEmployeeResponse[]> {
    if (!supervisorId)
      throw new EmployeeDomainException('Supervisor ID is required');
    return await this.userEmployeeRepository.findBySupervisor(supervisorId);
  }

  async findAllEmployees(
    limit: number,
    offset: number,
  ): Promise<UserEmployeeResponse[]> {
    if (limit <= 0 || offset < 0)
      throw new EmployeeDomainException('Limit must be > 0 and offset >= 0');
    return await this.userEmployeeRepository.findAllEmployees(limit, offset);
  }

  async existsByUserId(userId: string): Promise<boolean> {
    if (!userId) throw new EmployeeDomainException('User ID is required');
    return await this.userEmployeeRepository.existsByUserId(userId);
  }

  async existsByIdCard(idCard: string): Promise<boolean> {
    if (!idCard) throw new EmployeeDomainException('ID Card is required');
    return await this.userEmployeeRepository.existsByIdCard(idCard);
  }
}
