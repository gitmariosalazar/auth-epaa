import { UserEmployeeResponse } from '../../../../domain/schemas/dto/response/user-employee.response';
import { UserEmployeeSQLResult } from '../../../interface/sql/user-employee.sql.result';

export class UserEmployeeAdapter {
  static fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
    sqlResult: UserEmployeeSQLResult,
  ): UserEmployeeResponse {
    return {
      employeeId: sqlResult.employee_id,
      userId: sqlResult.user_id,
      citizenId: sqlResult.citizen_id,
      idCard: sqlResult.id_card,
      firstName: sqlResult.first_name,
      lastName: sqlResult.last_name,
      fullName: `${sqlResult.first_name} ${sqlResult.last_name}`.trim(),
      dateOfBirth: sqlResult.birth_date,
      positionId: sqlResult.position_id,
      contractTypeId: sqlResult.contract_type_id,
      employeeStatusId: sqlResult.employee_status_id,
      hireDate: sqlResult.hire_date,
      terminationDate: sqlResult.termination_date,
      assignedZones: [...sqlResult.assigned_zones],
      hasCompanyVehicle: sqlResult.has_company_vehicle,
      internalPhone: sqlResult.internal_phone,
      internalEmail: sqlResult.internal_email,
      photoUrl: sqlResult.photo_url,
      metadata: sqlResult.metadata || {},
      createdAt: sqlResult.created_at,
      updatedAt: sqlResult.updated_at,
      createdBy: sqlResult.created_by,
      updatedBy: sqlResult.updated_by,
      deletedAt: sqlResult.deleted_at,
    };
  }
}
