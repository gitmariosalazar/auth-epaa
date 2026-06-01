import { Inject, Injectable } from '@nestjs/common';
import { InterfaceCustomerRepository } from '../../domain/contracts/customer.interface.repository';
import { UpdateCustomerRequest } from '../../domain/schemas/dto/request/update.customer.request';
import { CustomerResponse } from '../../domain/schemas/dto/response/customer.response';
import {
  CustomerNotFoundException,
  CustomerDomainException,
} from '../../domain/exceptions/customer.exceptions';
import { CustomerModel } from '../../domain/schemas/models/customer.model';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: InterfaceCustomerRepository,
  ) {}

  async execute(
    customerUserId: string,
    updates: UpdateCustomerRequest,
  ): Promise<CustomerResponse> {
    const existing = await this.customerRepository.findById(customerUserId);
    if (!existing) {
      throw new CustomerNotFoundException(`User ID ${customerUserId}`);
    }

    const updatedModel = new CustomerModel({
      customerUserId: existing.customerUserId,
      clientId: existing.clientId,
      email: updates.email ?? existing.email,
      passwordHash: null, // Keep existing hash in DB unless password update is needed
      authMethod: existing.authMethod,
      authProvider: existing.authProvider,
      customerStatusId: updates.customerStatusId ?? existing.customerStatusId,
      failedAttempts: existing.failedAttempts,
      isLockedOut: existing.isLockedOut,
      twoFactorEnabled: updates.twoFactorEnabled ?? existing.twoFactorEnabled,
      emailVerified: updates.emailVerified ?? existing.emailVerified,
      telefonoVerified: updates.telefonoVerified ?? existing.telefonoVerified,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
      createdBy: existing.createdBy,
      updatedBy: updates.updatedBy,
      deletedAt: existing.deletedAt,
    });

    const result = await this.customerRepository.update(
      customerUserId,
      updatedModel,
    );

    if (!result) {
      throw new CustomerDomainException('Failed to update customer account');
    }

    return result;
  }
}
