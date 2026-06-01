import { Inject, Injectable } from '@nestjs/common';
import { InterfaceCustomerRepository } from '../../domain/contracts/customer.interface.repository';
import { CreateCustomerRequest } from '../../domain/schemas/dto/request/create.customer.request';
import { CustomerResponse } from '../../domain/schemas/dto/response/customer.response';
import {
  CustomerDomainException,
  CustomerAlreadyExistsException,
} from '../../domain/exceptions/customer.exceptions';
import { CustomerMapper } from '../mappers/customer.mapper';
import { validateFields } from '../../../../shared/validators/fields.validators';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: InterfaceCustomerRepository,
  ) {}

  async execute(
    request: CreateCustomerRequest,
  ): Promise<CustomerResponse> {
    const requiredFields = ['clientId', 'email'];
    const missingFieldsMessages = validateFields(request, requiredFields);
    if (missingFieldsMessages.length > 0) {
      throw new CustomerDomainException(missingFieldsMessages.join(', '));
    }

    // Check if client_usuario already exists for this client ID
    const existsByClientId = await this.customerRepository.existsByClientId(
      request.clientId,
    );
    if (existsByClientId) {
      throw new CustomerAlreadyExistsException(`Client ID ${request.clientId}`);
    }

    // Check if email is already taken
    const existsByEmail = await this.customerRepository.existsByEmail(
      request.email,
    );
    if (existsByEmail) {
      throw new CustomerAlreadyExistsException(`Email ${request.email}`);
    }

    const customerModel =
      CustomerMapper.fromCreateCustomerRequestToCustomerModel(request);

    let securityData: { passwordHash?: string } | undefined;
    if (request.password) {
      const passwordHash = await bcrypt.hash(request.password, 10);
      securityData = { passwordHash };
    }

    const createdCustomer = await this.customerRepository.create(
      customerModel,
      securityData,
    );

    if (!createdCustomer) {
      throw new CustomerDomainException('Failed to create customer account');
    }

    return createdCustomer;
  }
}
