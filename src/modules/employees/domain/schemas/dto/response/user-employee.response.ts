/**
 * DTO de respuesta seguro para un empleado (UserEmployeeResponse).
 * - Solo expone datos no sensibles.
 * - Calcula fullName para conveniencia.
 * - No incluye campos sensibles como baseSalary, supervisorId o metadata (pueden exponerse bajo roles específicos).
 * - Alineado con la tabla `empleados` sin campos extra.
 */
export interface UserEmployeeResponse {
  employeeId: string;
  userId: string;

  // Identificación personal
  citizenId?: string | null;
  idCard?: string | null;

  // Datos básicos
  firstName: string;
  lastName: string;
  fullName: string; // Calculado: firstName + lastName
  dateOfBirth?: Date | null;
  sexId?: number | null;

  // Laboral / HR
  positionId: number;
  contractTypeId: number;
  employeeStatusId: number;
  hireDate: Date;
  terminationDate?: Date | null;
  baseSalary?: number | null;

  // Asignaciones
  assignedZones: number[];

  // Seguridad y cumplimiento
  driverLicense?: string | null;
  hasCompanyVehicle: boolean;

  // Contacto
  internalPhone?: string | null;
  internalEmail?: string | null;
  photoUrl?: string | null;

  // Flexibilidad
  metadata: Record<string, any>;

  // Auditoría
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedAt?: Date | null;
}
