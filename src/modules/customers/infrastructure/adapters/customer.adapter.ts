import { CustomerResponse } from '../../domain/schemas/dto/response/customer.response';
import { CustomerSQLResult } from '../interface/sql/customer.sql.result';

export class CustomerAdapter {
  static fromSQLResultToResponse(row: CustomerSQLResult): CustomerResponse {
    return {
      customerUserId: row.customer_user_id,
      clientId: row.client_id,
      email: row.email,
      authMethod: row.auth_method,
      authProvider: row.auth_provider,
      customerStatusId: row.customer_status_id,
      isActive: row.customer_status_id === 1,
      failedAttempts: row.failed_attempts ?? 0,
      isLockedOut: row.is_locked_out ?? false,
      twoFactorEnabled: row.two_factor_enabled ?? false,
      emailVerified: row.email_verified ?? false,
      telefonoVerified: row.telefono_verified ?? false,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by,
      deletedAt: row.deleted_at,
    };
  }
}
