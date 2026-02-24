import { CreateUserEmployeeRequest } from '../../domain/schemas/dto/request/create.user-employee.request';
import { UpdateUserEmployeeRequest } from '../../domain/schemas/dto/request/update.user-employee.request';
import { UserEmployeeResponse } from '../../domain/schemas/dto/response/user-employee.response';
import { UserEmployeeModel } from '../../domain/schemas/models/user-employee.model';

/**
 * Mapper profesional para empleados.
 * - Usa setters públicos del modelo para actualizaciones.
 * - Crea nuevas instancias para mantener inmutabilidad donde sea posible.
 */
export class UserEmployeeMapper {
  static fromCreateUserEmployeeRequestToUserEmployeeModel(
    request: CreateUserEmployeeRequest,
    userId: string,
  ): UserEmployeeModel {
    return new UserEmployeeModel({
      employeeId: '', // Generado por DB
      userId: userId || request.userId,
      citizenId: request.citizenId,
      idCard: request.idCard,
      firstName: request.firstName,
      lastName: request.lastName,
      dateOfBirth: request.dateOfBirth,
      sexId: request.sexId,
      positionId: request.positionId,
      contractTypeId: request.contractTypeId,
      employeeStatusId: request.employeeStatusId ?? 1,
      hireDate: request.hireDate,
      terminationDate: request.terminationDate,
      baseSalary: request.baseSalary,
      supervisorId: request.supervisorId,
      assignedZones: request.assignedZones ?? [],
      driverLicense: request.driverLicense,
      hasCompanyVehicle: request.hasCompanyVehicle ?? false,
      internalPhone: request.internalPhone,
      internalEmail: request.internalEmail,
      photoUrl: request.photoUrl,
      metadata: request.metadata ?? {},
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: request.createdBy,
      updatedBy: request.createdBy,
      deletedAt: null,
    });
  }

  static fromUserEmployeeModelToUserEmployeeResponse(
    employee: UserEmployeeModel,
  ): UserEmployeeResponse {
    return {
      employeeId: employee.employeeId,
      userId: employee.userId,
      citizenId: employee.citizenId,
      idCard: employee.idCard,
      firstName: employee.firstName,
      lastName: employee.lastName,
      fullName: `${employee.firstName} ${employee.lastName}`.trim(),
      dateOfBirth: employee.dateOfBirth,
      positionId: employee.positionId,
      contractTypeId: employee.contractTypeId,
      employeeStatusId: employee.employeeStatusId,
      hireDate: employee.hireDate,
      terminationDate: employee.terminationDate,
      assignedZones: [...employee.assignedZones],
      hasCompanyVehicle: employee.hasCompanyVehicle,
      internalPhone: employee.internalPhone,
      internalEmail: employee.internalEmail,
      photoUrl: employee.photoUrl,
      metadata: employee.metadata,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      createdBy: employee.createdBy,
      updatedBy: employee.updatedBy,
      deletedAt: employee.deletedAt,
    };
  }

  static fromUpdateUserEmployeeRequestToUserEmployeeModel(
    employeeId: string,
    updates: UpdateUserEmployeeRequest,
    existingEmployee: UserEmployeeModel,
  ): UserEmployeeModel {
    // Creamos una nueva instancia con los cambios aplicados
    const updated = new UserEmployeeModel({
      employeeId: existingEmployee.employeeId || employeeId,
      userId: existingEmployee.userId,
      citizenId: updates.citizenId ?? existingEmployee.citizenId,
      idCard: updates.idCard ?? existingEmployee.idCard,
      firstName: updates.firstName ?? existingEmployee.firstName,
      lastName: updates.lastName ?? existingEmployee.lastName,
      dateOfBirth: updates.dateOfBirth ?? existingEmployee.dateOfBirth,
      sexId: updates.sexId ?? existingEmployee.sexId,
      positionId: updates.positionId ?? existingEmployee.positionId,
      contractTypeId: updates.contractTypeId ?? existingEmployee.contractTypeId,
      employeeStatusId:
        updates.employeeStatusId ?? existingEmployee.employeeStatusId,
      hireDate: existingEmployee.hireDate, // No cambiamos fecha de ingreso
      terminationDate:
        updates.terminationDate ?? existingEmployee.terminationDate,
      baseSalary: updates.baseSalary ?? existingEmployee.baseSalary,
      supervisorId: updates.supervisorId ?? existingEmployee.supervisorId,
      assignedZones: updates.assignedZones ?? [
        ...existingEmployee.assignedZones,
      ],
      driverLicense: updates.driverLicense ?? existingEmployee.driverLicense,
      hasCompanyVehicle:
        updates.hasCompanyVehicle ?? existingEmployee.hasCompanyVehicle,
      internalPhone: updates.internalPhone ?? existingEmployee.internalPhone,
      internalEmail: updates.internalEmail ?? existingEmployee.internalEmail,
      photoUrl: updates.photoUrl ?? existingEmployee.photoUrl,
      metadata: updates.metadata ?? { ...existingEmployee.metadata },
      createdAt: existingEmployee.createdAt,
      updatedAt: new Date(),
      createdBy: existingEmployee.createdBy,
      updatedBy: null, // Se llena en servicio
      deletedAt: existingEmployee.deletedAt,
    });

    return updated;
  }

  static fromUserEmployeeResponseToUserEmployeeModel(
    response: UserEmployeeResponse,
  ): UserEmployeeModel {
    if (!response || !response.employeeId) {
      throw new Error('Response inválido: falta employeeId');
    }

    return new UserEmployeeModel({
      employeeId: response.employeeId,
      userId: response.userId,
      citizenId: response.citizenId,
      idCard: response.idCard,
      firstName: response.firstName,
      lastName: response.lastName,
      dateOfBirth: response.dateOfBirth,
      sexId: null, // No disponible en response
      positionId: response.positionId,
      contractTypeId: response.contractTypeId,
      employeeStatusId: response.employeeStatusId,
      hireDate: response.hireDate,
      terminationDate: response.terminationDate,
      baseSalary: null, // Sensible, no exponer
      supervisorId: null, // Sensible, no exponer
      assignedZones: [...(response.assignedZones ?? [])],
      driverLicense: null, // Sensible, no exponer
      hasCompanyVehicle: false, // Sensible, no exponer
      internalPhone: response.internalPhone,
      internalEmail: response.internalEmail,
      photoUrl: response.photoUrl,
      metadata: {}, // Sensible, no exponer
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      createdBy: null, // No exponer
      updatedBy: null, // No exponer
      deletedAt: null,
    });
  }
}
