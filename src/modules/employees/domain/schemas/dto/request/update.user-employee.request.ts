export class UpdateUserEmployeeRequest {
  // Datos de autenticación (solo si se permite cambiar, muy restringido)
  username?: string; // Opcional y con validación estricta en backend
  email?: string; // Opcional, requiere verificación de nuevo email

  // Datos personales básicos (casi siempre opcionales)
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  sexId?: number;
  idCard?: string; // Cambiar cédula es raro, pero posible
  citizenId?: string; // Cambiar vínculo a ciudadano (raro)

  // Datos laborales (solo algunos se actualizan normalmente)
  positionId?: number; // Cambio de cargo
  contractTypeId?: number; // Cambio de contrato
  employeeStatusId?: number; // Cambio de estado (ej: de ACTIVO a SUSPENDIDO)
  terminationDate?: Date; // Fecha de salida (solo si se termina contrato)
  baseSalary?: number; // Ajuste salarial (con auditoría)
  supervisorId?: string; // Cambio de supervisor

  // Asignaciones (pueden cambiar)
  assignedZones?: number[]; // Reasignación de zonas

  // Seguridad y cumplimiento (cambios sensibles)
  driverLicense?: string;
  hasCompanyVehicle?: boolean;

  // Contacto (frecuentes en updates)
  internalPhone?: string;
  internalEmail?: string;
  photoUrl?: string;

  // Flexibilidad
  metadata?: Record<string, any>; // Actualizaciones dinámicas

  // Auditoría (se llena en backend, no se envía desde frontend)
  // updatedBy se agrega automáticamente en el servicio

  constructor(params: Partial<UpdateUserEmployeeRequest>) {
    this.username = params.username;
    this.email = params.email;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.dateOfBirth = params.dateOfBirth;
    this.sexId = params.sexId;
    this.idCard = params.idCard;
    this.citizenId = params.citizenId;
    this.positionId = params.positionId;
    this.contractTypeId = params.contractTypeId;
    this.employeeStatusId = params.employeeStatusId;
    this.terminationDate = params.terminationDate;
    this.baseSalary = params.baseSalary;
    this.supervisorId = params.supervisorId;
    this.assignedZones = params.assignedZones;
    this.driverLicense = params.driverLicense;
    this.hasCompanyVehicle = params.hasCompanyVehicle;
    this.internalPhone = params.internalPhone;
    this.internalEmail = params.internalEmail;
    this.photoUrl = params.photoUrl;
    this.metadata = params.metadata;
  }
}
