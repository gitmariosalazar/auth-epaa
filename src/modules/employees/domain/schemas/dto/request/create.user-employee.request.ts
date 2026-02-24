export class CreateUserEmployeeRequest {
  // Datos de autenticación (para crear el usuario interno)
  userId: string;
  username: string;
  email: string;
  password: string;

  // Datos personales básicos
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  sexId?: number;
  idCard?: string; // Cédula
  citizenId?: string; // FK a ciudadano (opcional)

  // Datos laborales (obligatorios para empleado)
  positionId: number; // cargo_id
  contractTypeId: number; // tipo_contrato_id
  employeeStatusId?: number; // Default: 1 (ACTIVO)
  hireDate: Date;
  terminationDate?: Date;
  baseSalary?: number;
  supervisorId?: string;

  // Asignaciones
  assignedZones?: number[];

  // Seguridad y cumplimiento
  driverLicense?: string;
  hasCompanyVehicle?: boolean;

  // Contacto
  internalPhone?: string;
  internalEmail?: string;
  photoUrl?: string;

  // Flexibilidad
  metadata?: Record<string, any>;

  // Auditoría (opcional, se llena en backend)
  createdBy?: string;

  constructor(params: {
    userId: string;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    sexId?: number;
    idCard?: string;
    citizenId?: string;
    positionId: number;
    contractTypeId: number;
    employeeStatusId?: number;
    hireDate: Date;
    terminationDate?: Date;
    baseSalary?: number;
    supervisorId?: string;
    assignedZones?: number[];
    driverLicense?: string;
    hasCompanyVehicle?: boolean;
    internalPhone?: string;
    internalEmail?: string;
    photoUrl?: string;
    metadata?: Record<string, any>;
    createdBy?: string;
  }) {
    this.userId = params.userId;
    this.username = params.username;
    this.email = params.email;
    this.password = params.password;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.dateOfBirth = params.dateOfBirth;
    this.sexId = params.sexId;
    this.idCard = params.idCard;
    this.citizenId = params.citizenId;
    this.positionId = params.positionId;
    this.contractTypeId = params.contractTypeId;
    this.employeeStatusId = params.employeeStatusId;
    this.hireDate = params.hireDate;
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
    this.createdBy = params.createdBy;
  }
}
