import { CustomerResponse } from '../../domain/schemas/dto/response/customer.response';
import { UserProfileResponse } from '../../domain/schemas/dto/response/user-profile.response';
import {
  CustomerSQLResult,
  UserProfileSQLResult,
} from '../interface/sql/customer.sql.result';

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

  static fromUserProfileSQLResultToResponse(
    row: UserProfileSQLResult,
  ): UserProfileResponse {
    return {
      userId: row.user_id,
      clientId: row.client_id,
      email: row.email,
      registerDate: row.register_date,
      company: row.company
        ? {
            ruc: row.company.ruc,
            address: row.company.address,
            country: row.company.country,
            clientId: row.company.client_id,
            parishId: row.company.parish_id,
            companyId: row.company.company_id,
            businessName: row.company.business_name,
            commercialName: row.company.commercial_name,
            phones: row.company.phones.map((phone) => ({
              telefonoid: phone.telefono_id,
              numero: phone.numero,
            })),
            emails: row.company.emails.map((email) => ({
              emailId: email.correo_electronico_id,
              email: email.correo,
            })),
          }
        : null,
      person: row.person
        ? {
            address: row.person.address,
            country: row.person.country,
            genderId: row.person.gender_id,
            lastName: row.person.last_name,
            parishId: row.person.parish_id,
            personId: row.person.person_id,
            birthDate: row.person.birth_date,
            firstName: row.person.first_name,
            isDeceased: row.person.is_deceased,
            professionId: row.person.profession_id,
            civilStatusId: row.person.civil_status_id,
            phones: row.person.phones.map((phone) => ({
              telefonoid: phone.telefono_id,
              numero: phone.numero,
            })),
            emails: row.person.emails.map((email) => ({
              emailId: email.correo_electronico_id,
              email: email.correo,
            })),
          }
        : null,
    };
  }
}
