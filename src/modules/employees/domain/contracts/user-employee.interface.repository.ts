import { UserEmployeeResponse } from '../schemas/dto/response/user-employee.response';
import { UserEmployeeModel } from '../schemas/models/user-employee.model';

/**
 * Interfaz del repositorio para empleados (UserEmployeeRepository).
 * Define los contratos para operaciones CRUD y de negocio relacionadas con empleados.
 * - Todos los métodos devuelven promesas para soporte asíncrono.
 * - Usa tipos seguros y consistentes con UserEmployeeModel y UserEmployeeResponse.
 * - Separa la lógica de acceso a datos de la lógica de negocio.
 * - Facilita la implementación de adaptadores específicos (PostgreSQL, MongoDB, etc.).
 * - Se implementan en las capas de infraestructura. (UserEmployeePostgreSqlPersistence, etc.).
 */
export interface InterfaceUserEmployeeRepository {
  // =============================================
  // Búsquedas básicas
  // =============================================
  /**
   * Busca un empleado por su ID único.
   * @param employeeId - ID del empleado
   * @returns Empleado encontrado o null si no existe
   */
  findById(employeeId: string): Promise<UserEmployeeResponse | null>;

  /**
   * Busca un empleado por el ID del usuario interno asociado.
   * @param userId - ID del usuario en la tabla usuarios
   * @returns Empleado encontrado o null si no existe
   */
  findByUserId(userId: string): Promise<UserEmployeeResponse | null>;

  /**
   * Busca empleados por cédula (identificación única).
   * @param idCard - Número de cédula
   * @returns Empleado encontrado o null
   */
  findByIdCard(idCard: string): Promise<UserEmployeeResponse | null>;

  /**
   * Busca empleados por nombre o apellido (búsqueda parcial).
   * @param searchTerm - Término de búsqueda (nombres o apellidos)
   * @returns Lista de empleados que coincidan
   */
  searchByName(searchTerm: string): Promise<UserEmployeeResponse[]>;

  // =============================================
  // Verificación de existencia
  // =============================================
  /**
   * Verifica si existe un empleado asociado a un usuario.
   * @param userId - ID del usuario interno
   * @returns true si ya existe un empleado vinculado
   */
  existsByUserId(userId: string): Promise<boolean>;

  /**
   * Verifica si existe un empleado con la cédula indicada.
   * @param idCard - Número de cédula
   * @returns true si ya existe
   */
  existsByIdCard(idCard: string): Promise<boolean>;

  // =============================================
  // CRUD completo
  // =============================================
  /**
   * Crea un nuevo empleado vinculado a un usuario interno.
   * @param employee - Modelo completo del empleado
   * @returns Empleado creado (con ID generado)
   */
  create(employee: UserEmployeeModel): Promise<UserEmployeeResponse>;

  /**
   * Actualiza un empleado existente (parcial).
   * @param employeeId - ID del empleado a actualizar
   * @param updates - Campos a modificar
   * @returns Empleado actualizado
   */
  update(
    employeeId: string,
    updates: Partial<UserEmployeeModel>,
  ): Promise<UserEmployeeResponse | null>;

  /**
   * Marca un empleado como eliminado (soft delete).
   * @param employeeId - ID del empleado
   */
  softDelete(employeeId: string): Promise<void>;

  /**
   * Restaura un empleado previamente eliminado.
   * @param employeeId - ID del empleado
   * @returns Empleado restaurado
   */
  restore(employeeId: string): Promise<UserEmployeeResponse | null>;

  // =============================================
  // Operaciones de negocio específicas
  // =============================================
  /**
   * Asigna o actualiza zonas a un empleado.
   * @param employeeId - ID del empleado
   * @param zoneIds - Lista de IDs de zonas
   */
  assignZones(employeeId: string, zoneIds: number[]): Promise<void>;

  /**
   * Cambia el estado laboral de un empleado (ACTIVO, SUSPENDIDO, etc.).
   * @param employeeId - ID del empleado
   * @param newStatusId - Nuevo estado_empleado_id
   */
  changeStatus(
    employeeId: string,
    newStatusId: number,
  ): Promise<UserEmployeeResponse | null>;

  /**
   * Cambia el supervisor de un empleado.
   * @param employeeId - ID del empleado
   * @param supervisorId - Nuevo supervisor (o null para quitar)
   */
  changeSupervisor(
    employeeId: string,
    supervisorId: string | null,
  ): Promise<UserEmployeeResponse | null>;

  // =============================================
  // Listados y filtros avanzados
  // =============================================
  /**
   * Obtiene todos los empleados activos.
   * @returns Lista de empleados activos
   */
  findAllActive(): Promise<UserEmployeeResponse[]>;

  /**
   * Obtiene empleados por cargo.
   * @param positionId - ID del cargo
   * @returns Lista de empleados en ese cargo
   */
  findByPosition(positionId: number): Promise<UserEmployeeResponse[]>;

  /**
   * Obtiene empleados por zona asignada.
   * @param zoneId - ID de la zona
   * @returns Lista de empleados asignados a esa zona
   */
  findByZone(zoneId: number): Promise<UserEmployeeResponse[]>;

  /**
   * Obtiene empleados bajo un supervisor específico.
   * @param supervisorId - ID del supervisor
   * @returns Lista de subordinados
   */
  findBySupervisor(supervisorId: string): Promise<UserEmployeeResponse[]>;

  /**
   * Get all employees with pagination.
   * @param limit - Maximum number of results
   * @param offset - Number of results to skip
   * @returns List of employees
   */
  findAllEmployees(
    limit: number,
    offset: number,
  ): Promise<UserEmployeeResponse[]>;
}
