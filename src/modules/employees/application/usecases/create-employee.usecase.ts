import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserEmployeeRepository } from '../../domain/contracts/user-employee.interface.repository';
import { CreateUserEmployeeRequest } from '../../domain/schemas/dto/request/create.user-employee.request';
import { UserEmployeeResponse } from '../../domain/schemas/dto/response/user-employee.response';
import {
  EmployeeDomainException,
  EmployeeAlreadyExistsException,
} from '../../domain/exceptions/employee.exceptions';
import { UserEmployeeMapper } from '../mappers/user-employee.mapper';
import { validateFields } from '../../../../shared/validators/fields.validators';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    @Inject('UserEmployeeRepository')
    private readonly userEmployeeRepository: InterfaceUserEmployeeRepository,
  ) {}

  async execute(
    request: CreateUserEmployeeRequest,
  ): Promise<UserEmployeeResponse> {
    const requiredFields = [
      'firstName',
      'lastName',
      'positionId',
      'contractTypeId',
      'hireDate',
    ];

    const missingFieldsMessages = validateFields(request, requiredFields);
    if (missingFieldsMessages.length > 0) {
      throw new EmployeeDomainException(missingFieldsMessages.join(', '));
    }

    const exists = await this.userEmployeeRepository.existsByUserId(
      request.userId,
    );
    if (exists) {
      throw new EmployeeAlreadyExistsException(`User ID ${request.userId}`);
    }

    const employeeModel =
      UserEmployeeMapper.fromCreateUserEmployeeRequestToUserEmployeeModel(
        request,
        request.userId,
      );

    const createdEmployee =
      await this.userEmployeeRepository.create(employeeModel);
    if (!createdEmployee) {
      throw new EmployeeDomainException('Failed to create employee');
    }

    return createdEmployee;
  }
}
