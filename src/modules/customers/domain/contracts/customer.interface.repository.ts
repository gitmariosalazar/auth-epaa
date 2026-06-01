import { CustomerResponse } from '../schemas/dto/response/customer.response';
import { CustomerModel } from '../schemas/models/customer.model';

export interface InterfaceCustomerRepository {
  findById(customerUserId: string): Promise<CustomerResponse | null>;
  findByClientId(clientId: string): Promise<CustomerResponse | null>;
  findByEmail(email: string): Promise<CustomerResponse | null>;
  existsByClientId(clientId: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  create(
    customer: CustomerModel,
    securityData?: { passwordHash?: string },
  ): Promise<CustomerResponse>;
  update(
    customerUserId: string,
    updates: Partial<CustomerModel>,
  ): Promise<CustomerResponse | null>;
  softDelete(customerUserId: string): Promise<void>;
  restore(customerUserId: string): Promise<CustomerResponse | null>;
  findAllCustomers(limit: number, offset: number): Promise<CustomerResponse[]>;
}
