import { Inject, Injectable } from '@nestjs/common';
import { InterfaceCustomerRepository } from '../../domain/contracts/customer.interface.repository';
import { CustomerNotFoundException } from '../../domain/exceptions/customer.exceptions';
import { CustomerResponse } from '../../domain/schemas/dto/response/customer.response';

@Injectable()
export class DeleteCustomerUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: InterfaceCustomerRepository,
  ) {}

  async softDelete(customerUserId: string): Promise<void> {
    const existing = await this.customerRepository.findById(customerUserId);
    if (!existing) {
      throw new CustomerNotFoundException(`User ID ${customerUserId}`);
    }
    await this.customerRepository.softDelete(customerUserId);
  }

  async restore(customerUserId: string): Promise<CustomerResponse> {
    const existing = await this.customerRepository.findById(customerUserId);
    if (!existing) {
      throw new CustomerNotFoundException(`User ID ${customerUserId}`);
    }
    const result = await this.customerRepository.restore(customerUserId);
    if (!result) {
      throw new CustomerNotFoundException(`User ID ${customerUserId}`);
    }
    return result;
  }
}
