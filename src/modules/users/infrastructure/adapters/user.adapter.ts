import {
  CustomerWithRolesAndPermissionsResponse,
  UserResponse,
  UserResponseWithPermissionsResponse,
  UserResponseWithRolesAndPermissionsResponse,
  UserResponseWithRolesResponse,
} from '../../domain/schemas/dto/response/user.response';
import {
  CustomerWithRolesAndPermissionsSQLResult,
  UserSQLResult,
  UserWithPermissionsSQLResult,
  UserWithRolesAndPermissionsSQLResult,
  UserWithRolesSQLResult,
} from '../interfaces/sql/user.sql.result';

export class UserAdapter {
  static fromUserSQLResultToUserResponse(user: UserSQLResult): UserResponse {
    return {
      userId: user.user_id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      dateOfBirth: user.date_of_birth,
      sexId: user.sex_id,
      cardId: user.card_id,
      citizenId: user.citizen_id,
      positionId: user.position_id,
      contractTypeId: user.contract_type_id,
      employeeStatusId: user.employee_status_id,
      hireDate: user.hire_date,
      terminationDate: user.termination_date,
      baseSalary: user.base_salary,
      supervisorId: user.supervisor_id,
      assignedZones: user.assigned_zones,
      driverLicense: user.driver_license,
      hasCompanyVehicle: user.has_company_vehicle,
      internalPhone: user.internal_phone,
      internalEmail: user.internal_email,
      photoUrl: user.photo_url,
      createdBy: user.created_by,
      registeredAt: user.registered_at,
      lastLogin: user.last_login,
      failedAttempts: user.failed_attempts,
      twoFactorEnabled: Boolean(user.two_factor_enabled),
      isActive: Boolean(user.is_active),
      observations: user.observations,
    };
  }

  static fromUserWithRolesAndPermissionsSQLResultToUserWithRolesAndPermissionsResponse(
    user: UserWithRolesAndPermissionsSQLResult,
  ): UserResponseWithRolesAndPermissionsResponse {
    return {
      userId: user.user_id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      dateOfBirth: user.date_of_birth,
      sexId: user.sex_id,
      cardId: user.card_id,
      citizenId: user.citizen_id,
      positionId: user.position_id,
      contractTypeId: user.contract_type_id,
      employeeStatusId: user.employee_status_id,
      hireDate: user.hire_date,
      terminationDate: user.termination_date,
      baseSalary: user.base_salary,
      supervisorId: user.supervisor_id,
      assignedZones: user.assigned_zones,
      driverLicense: user.driver_license,
      hasCompanyVehicle: user.has_company_vehicle,
      internalPhone: user.internal_phone,
      internalEmail: user.internal_email,
      photoUrl: user.photo_url,
      createdBy: user.created_by,
      registeredAt: user.registered_at,
      lastLogin: user.last_login,
      failedAttempts: user.failed_attempts,
      twoFactorEnabled: Boolean(user.two_factor_enabled),
      isActive: Boolean(user.is_active),
      observations: user.observations,
      passwordHash: user.password_hash,
      roles: user.roles,
      permissions: user.permissions,
    };
  }

  static fromUserWithPermissionsSQLResultToUserWithPermissionsResponse(
    user: UserWithPermissionsSQLResult,
  ): UserResponseWithPermissionsResponse {
    return {
      userId: user.user_id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      dateOfBirth: user.date_of_birth,
      sexId: user.sex_id,
      cardId: user.card_id,
      citizenId: user.citizen_id,
      positionId: user.position_id,
      contractTypeId: user.contract_type_id,
      employeeStatusId: user.employee_status_id,
      hireDate: user.hire_date,
      terminationDate: user.termination_date,
      baseSalary: user.base_salary,
      supervisorId: user.supervisor_id,
      assignedZones: user.assigned_zones,
      driverLicense: user.driver_license,
      hasCompanyVehicle: user.has_company_vehicle,
      internalPhone: user.internal_phone,
      internalEmail: user.internal_email,
      photoUrl: user.photo_url,
      createdBy: user.created_by,
      registeredAt: user.registered_at,
      lastLogin: user.last_login,
      failedAttempts: user.failed_attempts,
      twoFactorEnabled: Boolean(user.two_factor_enabled),
      isActive: Boolean(user.is_active),
      observations: user.observations,
      permissions: user.permissions,
    };
  }

  static fromUserWithRolesSQLResultToUserWithRolesResponse(
    user: UserWithRolesSQLResult,
  ): UserResponseWithRolesResponse {
    return {
      userId: user.user_id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      dateOfBirth: user.date_of_birth,
      sexId: user.sex_id,
      cardId: user.card_id,
      citizenId: user.citizen_id,
      positionId: user.position_id,
      contractTypeId: user.contract_type_id,
      employeeStatusId: user.employee_status_id,
      hireDate: user.hire_date,
      terminationDate: user.termination_date,
      baseSalary: user.base_salary,
      supervisorId: user.supervisor_id,
      assignedZones: user.assigned_zones,
      driverLicense: user.driver_license,
      hasCompanyVehicle: user.has_company_vehicle,
      internalPhone: user.internal_phone,
      internalEmail: user.internal_email,
      photoUrl: user.photo_url,
      createdBy: user.created_by,
      registeredAt: user.registered_at,
      lastLogin: user.last_login,
      failedAttempts: user.failed_attempts,
      twoFactorEnabled: Boolean(user.two_factor_enabled),
      isActive: Boolean(user.is_active),
      observations: user.observations,
      roles: user.roles,
    };
  }

  static fromCustomerWithRolesAndPermissionsSQLResultToCustomerWithRolesAndPermissionsResponse(
    user: CustomerWithRolesAndPermissionsSQLResult,
  ): CustomerWithRolesAndPermissionsResponse {
    return {
      userId: user.user_id,
      username: user.username,
      email: user.email,
      registeredAt: user.registered_at,
      lastLogin: user.last_login,
      failedAttempts: user.failed_attempts,
      twoFactorEnabled: Boolean(user.two_factor_enabled),
      isActive: Boolean(user.is_active),
      observations: user.observations,
      passwordHash: user.password_hash,
      company: user.company
        ? {
            ruc: user.company.ruc,
            address: user.company.address,
            country: user.company.country,
            clientId: user.company.client_id,
            parishId: user.company.parish_id,
            companyId: user.company.company_id,
            businessName: user.company.business_name,
            commercialName: user.company.commercial_name,
            phones: user.company.phones.map((phone) => ({
              telefonoId: phone.telefono_id,
              numero: phone.numero,
            })),
            emails: user.company.emails.map((email) => ({
              correoElectronicoId: email.correo_electronico_id,
              correo: email.correo,
            })),
          }
        : null,
      person: user.person
        ? {
            address: user.person.address,
            country: user.person.country,
            genderId: user.person.gender_id,
            lastName: user.person.last_name,
            parishId: user.person.parish_id,
            personId: user.person.person_id,
            birthDate: user.person.birth_date,
            firstName: user.person.first_name,
            isDeceased: user.person.is_deceased,
            professionId: user.person.profession_id,
            civilStatusId: user.person.civil_status_id,
            phones: user.person.phones.map((phone) => ({
              telefonoId: phone.telefono_id,
              numero: phone.numero,
            })),
            emails: user.person.emails.map((email) => ({
              correoElectronicoId: email.correo_electronico_id,
              correo: email.correo,
            })),
          }
        : null,
      roles: user.roles,
      permissions: user.permissions,
    };
  }
}
