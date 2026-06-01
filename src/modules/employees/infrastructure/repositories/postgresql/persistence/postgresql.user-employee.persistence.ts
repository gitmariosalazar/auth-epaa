import {
  DatabaseAbstract,
  IDatabaseClient,
} from '../../../../../../shared/connections/database/abstract/abstract.database';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { InterfaceUserEmployeeRepository } from '../../../../domain/contracts/user-employee.interface.repository';
import { UserEmployeeResponse } from '../../../../domain/schemas/dto/response/user-employee.response';
import { UserEmployeeModel } from '../../../../domain/schemas/models/user-employee.model';
import { UserEmployeeSQLResult } from '../../../interface/sql/user-employee.sql.result';
import { UserEmployeeAdapter } from '../../../adapters/user-employe.adapter';

@Injectable()
export class PostgreSQLUserEmployeePersistence implements InterfaceUserEmployeeRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  private readonly SELECT_ALL_FIELDS = `
    empleado_id AS employee_id,
    usuario_id AS user_id,
    ciudadano_id AS citizen_id,
    cedula AS id_card,
    nombres AS first_name,
    apellidos AS last_name,
    fecha_nacimiento AS birth_date,
    sexo_id AS sex_id,
    cargo_id AS position_id,
    tipo_contrato_id AS contract_type_id,
    estado_empleado_id AS employee_status_id,
    fecha_ingreso AS hire_date,
    fecha_salida AS termination_date,
    salario_base AS base_salary,
    supervisor_id AS supervisor_id,
    zonas_asignadas AS assigned_zones,
    licencia_conducir AS driver_license,
    tiene_vehiculo_empresa AS has_company_vehicle,
    telefono_interno AS internal_phone,
    email_interno AS internal_email,
    foto_url AS photo_url,
    metadata AS metadata,
    created_at AS created_at,
    updated_at AS updated_at,
    created_by AS created_by,
    updated_by AS updated_by,
    deleted_at AS deleted_at
  `;

  async findById(employeeId: string): Promise<UserEmployeeResponse | null> {
    const query = `SELECT ${this.SELECT_ALL_FIELDS} FROM empleados WHERE empleado_id = $1 AND deleted_at IS NULL;`;
    const result = await this.databaseService.query<UserEmployeeSQLResult>(
      query,
      [employeeId],
    );
    return result.length > 0
      ? UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
          result[0],
        )
      : null;
  }

  async findByUserId(userId: string): Promise<UserEmployeeResponse | null> {
    const query = `SELECT ${this.SELECT_ALL_FIELDS} FROM empleados WHERE usuario_id = $1 AND deleted_at IS NULL;`;
    const result = await this.databaseService.query<UserEmployeeSQLResult>(
      query,
      [userId],
    );
    return result.length > 0
      ? UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
          result[0],
        )
      : null;
  }

  async findByIdCard(idCard: string): Promise<UserEmployeeResponse | null> {
    const query = `SELECT ${this.SELECT_ALL_FIELDS} FROM empleados WHERE cedula = $1 AND deleted_at IS NULL;`;
    const result = await this.databaseService.query<UserEmployeeSQLResult>(
      query,
      [idCard],
    );
    return result.length > 0
      ? UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
          result[0],
        )
      : null;
  }

  async searchByName(searchTerm: string): Promise<UserEmployeeResponse[]> {
    const query = `SELECT ${this.SELECT_ALL_FIELDS} FROM empleados WHERE (nombres ILIKE $1 OR apellidos ILIKE $1) AND deleted_at IS NULL LIMIT 50;`;
    const result = await this.databaseService.query<UserEmployeeSQLResult>(
      query,
      [`%${searchTerm}%`],
    );
    return result.map((row) =>
      UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
        row,
      ),
    );
  }

  async existsByUserId(userId: string): Promise<boolean> {
    const query = `SELECT 1 FROM empleados WHERE usuario_id = $1 AND deleted_at IS NULL LIMIT 1;`;
    const result = await this.databaseService.query<any>(query, [userId]);
    return result.length > 0;
  }

  async existsByIdCard(idCard: string): Promise<boolean> {
    const query = `SELECT 1 FROM empleados WHERE cedula = $1 AND deleted_at IS NULL LIMIT 1;`;
    const result = await this.databaseService.query<any>(query, [idCard]);
    return result.length > 0;
  }

  async create(
    employee: UserEmployeeModel,
    securityData?: { username?: string; email?: string; passwordHash?: string },
  ): Promise<UserEmployeeResponse> {
    return await this.databaseService.transaction(
      async (client: IDatabaseClient) => {
        let finalUserId = employee.userId;

        if (securityData?.username && securityData?.email && securityData?.passwordHash) {
          const userResult = await client.query<any>(
            `INSERT INTO public.usuarios (username, email, password_hash, created_at, updated_at) 
             VALUES ($1, $2, $3, NOW(), NOW()) 
             RETURNING usuario_id`,
            [securityData.username, securityData.email, securityData.passwordHash],
          );
          finalUserId = userResult[0].usuario_id;
        }

        let finalCitizenId: string;
        if (employee.citizenId) {
          const { affectedRows: rowCount } = await client.execute(
            'SELECT 1 FROM ciudadano WHERE ciudadano_id = $1',
            [employee.citizenId],
          );
          if (rowCount === 0)
            throw new RpcException({
              statusCode: statusCode.BAD_REQUEST,
              message: 'Citizen not found',
            });
          finalCitizenId = employee.citizenId;
        } else {
          const rows = await client.query<any>(
            'INSERT INTO ciudadano (ciudadano_id, nombres, apellidos, created_at, updated_at) VALUES (uuid_generate_v4(), $1, $2, NOW(), NOW()) RETURNING ciudadano_id',
            [employee.firstName, employee.lastName],
          );
          finalCitizenId = rows[0].ciudadano_id;
        }

        const query = `INSERT INTO empleados (usuario_id, ciudadano_id, cedula, nombres, apellidos, cargo_id, tipo_contrato_id, estado_empleado_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING ${this.SELECT_ALL_FIELDS}`;
        const employeeRows = await client.query<UserEmployeeSQLResult>(query, [
          finalUserId,
          finalCitizenId,
          employee.idCard,
          employee.firstName,
          employee.lastName,
          employee.positionId,
          employee.contractTypeId,
          employee.employeeStatusId,
        ]);
        return UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
          employeeRows[0],
        );
      },
    );
  }

  async update(
    employeeId: string,
    updates: Partial<UserEmployeeModel>,
  ): Promise<UserEmployeeResponse | null> {
    const query = `UPDATE empleados SET nombres = COALESCE($1, nombres), apellidos = COALESCE($2, apellidos), updated_at = NOW() WHERE empleado_id = $3 AND deleted_at IS NULL RETURNING ${this.SELECT_ALL_FIELDS}`;
    const result = await this.databaseService.query<UserEmployeeSQLResult>(
      query,
      [updates.firstName, updates.lastName, employeeId],
    );
    return result.length > 0
      ? UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
          result[0],
        )
      : null;
  }

  async softDelete(employeeId: string): Promise<void> {
    await this.databaseService.execute(
      'UPDATE empleados SET deleted_at = NOW() WHERE empleado_id = $1',
      [employeeId],
    );
  }

  async restore(employeeId: string): Promise<UserEmployeeResponse | null> {
    const query = `UPDATE empleados SET deleted_at = NULL WHERE empleado_id = $1 RETURNING ${this.SELECT_ALL_FIELDS}`;
    const result = await this.databaseService.query<UserEmployeeSQLResult>(
      query,
      [employeeId],
    );
    return result.length > 0
      ? UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
          result[0],
        )
      : null;
  }

  async assignZones(employeeId: string, zoneIds: number[]): Promise<void> {
    await this.databaseService.execute(
      'UPDATE empleados SET zonas_asignadas = $1 WHERE empleado_id = $2',
      [JSON.stringify(zoneIds), employeeId],
    );
  }

  async changeStatus(
    employeeId: string,
    newStatusId: number,
  ): Promise<UserEmployeeResponse | null> {
    const query = `UPDATE empleados SET estado_empleado_id = $1 WHERE empleado_id = $2 RETURNING ${this.SELECT_ALL_FIELDS}`;
    const result = await this.databaseService.query<UserEmployeeSQLResult>(
      query,
      [newStatusId, employeeId],
    );
    return result.length > 0
      ? UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
          result[0],
        )
      : null;
  }

  async changeSupervisor(
    employeeId: string,
    supervisorId: string | null,
  ): Promise<UserEmployeeResponse | null> {
    const query = `UPDATE empleados SET supervisor_id = $1 WHERE empleado_id = $2 RETURNING ${this.SELECT_ALL_FIELDS}`;
    const result = await this.databaseService.query<UserEmployeeSQLResult>(
      query,
      [supervisorId, employeeId],
    );
    return result.length > 0
      ? UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
          result[0],
        )
      : null;
  }

  async findAllActive(): Promise<UserEmployeeResponse[]> {
    const query = `SELECT ${this.SELECT_ALL_FIELDS} FROM empleados WHERE deleted_at IS NULL;`;
    const result =
      await this.databaseService.query<UserEmployeeSQLResult>(query);
    return result.map((row) =>
      UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
        row,
      ),
    );
  }

  async findByPosition(positionId: number): Promise<UserEmployeeResponse[]> {
    const query = `SELECT ${this.SELECT_ALL_FIELDS} FROM empleados WHERE cargo_id = $1 AND deleted_at IS NULL;`;
    const result = await this.databaseService.query<UserEmployeeSQLResult>(
      query,
      [positionId],
    );
    return result.map((row) =>
      UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
        row,
      ),
    );
  }

  async findByZone(zoneId: number): Promise<UserEmployeeResponse[]> {
    const query = `SELECT ${this.SELECT_ALL_FIELDS} FROM empleados WHERE zonas_asignadas @> $1::jsonb AND deleted_at IS NULL;`;
    const result = await this.databaseService.query<UserEmployeeSQLResult>(
      query,
      [JSON.stringify([zoneId])],
    );
    return result.map((row) =>
      UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
        row,
      ),
    );
  }

  async findBySupervisor(
    supervisorId: string,
  ): Promise<UserEmployeeResponse[]> {
    const query = `SELECT ${this.SELECT_ALL_FIELDS} FROM empleados WHERE supervisor_id = $1 AND deleted_at IS NULL;`;
    const result = await this.databaseService.query<UserEmployeeSQLResult>(
      query,
      [supervisorId],
    );
    return result.map((row) =>
      UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
        row,
      ),
    );
  }

  async findAllEmployees(
    limit: number,
    offset: number,
  ): Promise<UserEmployeeResponse[]> {
    const query = `SELECT ${this.SELECT_ALL_FIELDS} FROM empleados WHERE deleted_at IS NULL LIMIT $1 OFFSET $2;`;
    const result = await this.databaseService.query<UserEmployeeSQLResult>(
      query,
      [limit, offset],
    );
    return result.map((row) =>
      UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
        row,
      ),
    );
  }
}
