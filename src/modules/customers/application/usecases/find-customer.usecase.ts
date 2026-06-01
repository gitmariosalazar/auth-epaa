import { Inject, Injectable } from '@nestjs/common';
import { InterfaceCustomerRepository } from '../../domain/contracts/customer.interface.repository';
import { CustomerResponse } from '../../domain/schemas/dto/response/customer.response';
import { CustomerNotFoundException } from '../../domain/exceptions/customer.exceptions';

@Injectable()
export class FindCustomerUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: InterfaceCustomerRepository,
  ) {}

  async findById(customerUserId: string): Promise<CustomerResponse> {
    const customer = await this.customerRepository.findById(customerUserId);
    if (!customer) {
      throw new CustomerNotFoundException(`User ID ${customerUserId}`);
    }
    return customer;
  }

  async findByClientId(clientId: string): Promise<CustomerResponse> {
    const customer = await this.customerRepository.findByClientId(clientId);
    if (!customer) {
      throw new CustomerNotFoundException(`Client ID ${clientId}`);
    }
    return customer;
  }

  async findByEmail(email: string): Promise<CustomerResponse> {
    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      throw new CustomerNotFoundException(`Email ${email}`);
    }
    return customer;
  }

  async findAll(limit = 10, offset = 0): Promise<CustomerResponse[]> {
    return await this.customerRepository.findAllCustomers(limit, offset);
  }
}
