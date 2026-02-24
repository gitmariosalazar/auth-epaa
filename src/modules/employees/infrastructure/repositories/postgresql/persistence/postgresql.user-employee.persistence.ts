import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { InterfaceUserEmployeeRepository } from '../../../../domain/contracts/user-employee.interface.repository';
import { UserEmployeeResponse } from '../../../../domain/schemas/dto/response/user-employee.response';
import { UserEmployeeModel } from '../../../../domain/schemas/models/user-employee.model';
import { UserEmployeeSQLResult } from '../../../interface/sql/user-employee.sql.result';
import { DatabaseServicePostgreSQL } from '../../../../../../shared/connections/database/postgresql/postgresql.service';
import { UserEmployeeAdapter } from '../adapters/user-employe.adapter';

@Injectable()
export class PostgreSQLUserEmployeePersistence implements InterfaceUserEmployeeRepository {
  constructor(private readonly postgresqlService: DatabaseServicePostgreSQL) {}

  async findById(employeeId: string): Promise<UserEmployeeResponse | null> {
    try {
      if (!employeeId || employeeId.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Employee ID must be provided and non-empty',
        });
      }

      const query = `
        SELECT
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
        FROM empleados
        WHERE empleado_id = $1
          AND deleted_at IS NULL;
      `;

      const params = [employeeId];
      const result = await this.postgresqlService.query<UserEmployeeSQLResult>(
        query,
        params,
      );

      if (result.length === 0) {
        return null; // No lanzamos excepción aquí, retornamos null para que el service lo maneje
      }

      // Mapeo usando adapter (o mapper si prefieres)
      const mappedResult =
        UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
          result[0],
        );
      return mappedResult;
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<UserEmployeeResponse | null> {
    try {
      if (!userId || userId.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'User ID must be provided and non-empty',
        });
      }

      const query = `
        SELECT
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
        FROM empleados
        WHERE usuario_id = $1
          AND deleted_at IS NULL;
      `;

      const params = [userId];
      const result = await this.postgresqlService.query<UserEmployeeSQLResult>(
        query,
        params,
      );

      if (result.length === 0) {
        return null;
      }

      return UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
        result[0],
      );
    } catch (error) {
      throw error;
    }
  }

  async findByIdCard(idCard: string): Promise<UserEmployeeResponse | null> {
    try {
      if (!idCard || idCard.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'ID Card must be provided and non-empty',
        });
      }

      const query = `
        SELECT
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
        FROM empleados
        WHERE cedula = $1
          AND deleted_at IS NULL;
      `;

      const params = [idCard];
      const result = await this.postgresqlService.query<UserEmployeeSQLResult>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Employee with ID Card ${idCard} not found`,
        });
      }

      return UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
        result[0],
      );
    } catch (error) {
      throw error;
    }
  }

  async searchByName(searchTerm: string): Promise<UserEmployeeResponse[]> {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Search term must be provided and non-empty',
        });
      }

      const query = `
        SELECT
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
        FROM empleados
        WHERE (nombres ILIKE $1 OR apellidos ILIKE $1)
          AND deleted_at IS NULL
        ORDER BY nombres, apellidos
        LIMIT 50;
      `;

      const params = [`%${searchTerm.trim()}%`];
      const result = await this.postgresqlService.query<UserEmployeeSQLResult>(
        query,
        params,
      );

      return result.map((row) =>
        UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
          row,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async existsByUserId(userId: string): Promise<boolean> {
    try {
      if (!userId || userId.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'User ID must be provided and non-empty',
        });
      }

      const query = `SELECT 1 FROM empleados WHERE usuario_id = $1 AND deleted_at IS NULL LIMIT 1;`;
      const result = await this.postgresqlService.query(query, [userId]);

      return result.length > 0;
    } catch (error) {
      throw error;
    }
  }

  async existsByIdCard(idCard: string): Promise<boolean> {
    try {
      if (!idCard || idCard.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'ID Card must be provided and non-empty',
        });
      }

      const query = `SELECT 1 FROM empleados WHERE cedula = $1 AND deleted_at IS NULL LIMIT 1;`;
      const result = await this.postgresqlService.query(query, [idCard]);

      return result.length > 0;
    } catch (error) {
      throw error;
    }
  }

  async create(employee: UserEmployeeModel): Promise<UserEmployeeResponse> {
    try {
      const result = await this.postgresqlService.transaction(
        async (client) => {
          let finalCitizenId: string | null | undefined = employee.citizenId;

          // 1. Verificar si el ciudadano ya existe (si se envió citizenId)
          if (employee.citizenId) {
            const citizenCheckQuery = `
          SELECT ciudadano_id 
          FROM ciudadano 
          WHERE ciudadano_id = $1 
          LIMIT 1;
        `;
            const citizenCheck = await client.query(citizenCheckQuery, [
              employee.citizenId,
            ]);

            if (citizenCheck.rowCount === 0) {
              // citizenId enviado pero NO existe → error (o puedes insertar, según tu negocio)
              throw new RpcException({
                statusCode: statusCode.BAD_REQUEST,
                message: `Citizen ID ${employee.citizenId} does not exist in ciudadano table`,
              });
            }

            // Existe → usamos ese ID (los datos ya están en ciudadano)
          } else {
            // No se envió citizenId → crear nuevo ciudadano con datos del request
            const insertCitizenQuery = `
          INSERT INTO ciudadano (
            ciudadano_id,
            nombres,
            apellidos,
            fecha_nacimiento,
            sexo_id,
            created_at,
            updated_at
          ) VALUES (
            uuid_generate_v4(),
            $1,
            $2,
            $3,
            $4,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          )
          RETURNING ciudadano_id;
        `;

            const citizenParams = [
              employee.firstName || 'SIN NOMBRE',
              employee.lastName || 'SIN APELLIDO',
              employee.dateOfBirth || null,
              employee.sexId || null,
            ];

            const citizenResult = await client.query(
              insertCitizenQuery,
              citizenParams,
            );

            if (citizenResult.rowCount === 0) {
              throw new RpcException({
                statusCode: statusCode.INTERNAL_SERVER_ERROR,
                message: 'Failed to create citizen record',
              });
            }

            finalCitizenId = citizenResult.rows[0].ciudadano_id;
          }

          // 2. Insertar el empleado con el citizenId final
          const insertEmployeeQuery = `
        INSERT INTO empleados (
          usuario_id,
          ciudadano_id,
          cedula,
          nombres,
          apellidos,
          fecha_nacimiento,
          sexo_id,
          cargo_id,
          tipo_contrato_id,
          estado_empleado_id,
          fecha_ingreso,
          fecha_salida,
          salario_base,
          supervisor_id,
          zonas_asignadas,
          licencia_conducir,
          tiene_vehiculo_empresa,
          telefono_interno,
          email_interno,
          foto_url,
          metadata,
          created_at,
          updated_at,
          created_by,
          updated_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
        )
        RETURNING
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
          deleted_at AS deleted_at;
      `;

          const employeeParams = [
            employee.userId,
            finalCitizenId,
            employee.idCard,
            employee.firstName,
            employee.lastName,
            employee.dateOfBirth,
            employee.sexId,
            employee.positionId,
            employee.contractTypeId,
            employee.employeeStatusId,
            employee.hireDate,
            employee.terminationDate,
            employee.baseSalary,
            employee.supervisorId,
            employee.assignedZones,
            employee.driverLicense,
            employee.hasCompanyVehicle,
            employee.internalPhone,
            employee.internalEmail,
            employee.photoUrl,
            employee.metadata,
            employee.createdAt,
            employee.updatedAt,
            employee.createdBy,
            employee.updatedBy,
          ];

          const employeeResult = await client.query<UserEmployeeSQLResult>(
            insertEmployeeQuery,
            employeeParams,
          );

          if (employeeResult.rowCount === 0) {
            throw new RpcException({
              statusCode: statusCode.INTERNAL_SERVER_ERROR,
              message: 'Failed to create employee record',
            });
          }

          return UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
            employeeResult.rows[0],
          );
        },
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async update(
    employeeId: string,
    updates: Partial<UserEmployeeModel>,
  ): Promise<UserEmployeeResponse | null> {
    const client = await this.postgresqlService.getClient();

    try {
      await client.query('BEGIN');

      // 1. Verificar que el empleado existe
      const employeeCheckQuery = `
      SELECT ciudadano_id, nombres, apellidos, fecha_nacimiento, sexo_id
      FROM empleados 
      WHERE empleado_id = $1 AND deleted_at IS NULL;
    `;
      const employeeCheck = await client.query(employeeCheckQuery, [
        employeeId,
      ]);

      if (employeeCheck.rowCount === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Employee with ID ${employeeId} not found or already deleted`,
        });
      }

      const existing = employeeCheck.rows[0];
      const citizenId = existing.ciudadano_id;

      // 2. Si hay ciudadano_id y se envían datos personales → actualizar ciudadano también
      if (
        citizenId &&
        (updates.firstName !== undefined ||
          updates.lastName !== undefined ||
          updates.dateOfBirth !== undefined ||
          updates.sexId !== undefined)
      ) {
        const citizenUpdateClauses: string[] = [];
        const citizenParams: any[] = [];
        let citizenParamIndex = 1;

        if (updates.firstName !== undefined) {
          citizenUpdateClauses.push(`nombres = $${citizenParamIndex}`);
          citizenParams.push(updates.firstName);
          citizenParamIndex++;
        }
        if (updates.lastName !== undefined) {
          citizenUpdateClauses.push(`apellidos = $${citizenParamIndex}`);
          citizenParams.push(updates.lastName);
          citizenParamIndex++;
        }
        if (updates.dateOfBirth !== undefined) {
          citizenUpdateClauses.push(`fecha_nacimiento = $${citizenParamIndex}`);
          citizenParams.push(updates.dateOfBirth);
          citizenParamIndex++;
        }
        if (updates.sexId !== undefined) {
          citizenUpdateClauses.push(`sexo_id = $${citizenParamIndex}`);
          citizenParams.push(updates.sexId);
          citizenParamIndex++;
        }

        if (citizenUpdateClauses.length > 0) {
          citizenUpdateClauses.push(`updated_at = CURRENT_TIMESTAMP`);

          const citizenUpdateQuery = `
          UPDATE ciudadano
          SET ${citizenUpdateClauses.join(', ')}
          WHERE ciudadano_id = $${citizenParamIndex}
        `;

          citizenParams.push(citizenId);

          await client.query(citizenUpdateQuery, citizenParams);
        }
      }

      // 3. Actualizar la tabla empleados (solo campos enviados)
      const employeeSetClauses: string[] = [];
      const employeeParams: any[] = [];
      let employeeParamIndex = 1;

      if (updates.citizenId !== undefined) {
        employeeSetClauses.push(`ciudadano_id = $${employeeParamIndex}`);
        employeeParams.push(updates.citizenId);
        employeeParamIndex++;
      }
      if (updates.idCard !== undefined) {
        employeeSetClauses.push(`cedula = $${employeeParamIndex}`);
        employeeParams.push(updates.idCard);
        employeeParamIndex++;
      }
      if (updates.firstName !== undefined) {
        employeeSetClauses.push(`nombres = $${employeeParamIndex}`);
        employeeParams.push(updates.firstName);
        employeeParamIndex++;
      }
      if (updates.lastName !== undefined) {
        employeeSetClauses.push(`apellidos = $${employeeParamIndex}`);
        employeeParams.push(updates.lastName);
        employeeParamIndex++;
      }
      if (updates.dateOfBirth !== undefined) {
        employeeSetClauses.push(`fecha_nacimiento = $${employeeParamIndex}`);
        employeeParams.push(updates.dateOfBirth);
        employeeParamIndex++;
      }
      if (updates.sexId !== undefined) {
        employeeSetClauses.push(`sexo_id = $${employeeParamIndex}`);
        employeeParams.push(updates.sexId);
        employeeParamIndex++;
      }
      if (updates.positionId !== undefined) {
        employeeSetClauses.push(`cargo_id = $${employeeParamIndex}`);
        employeeParams.push(updates.positionId);
        employeeParamIndex++;
      }
      if (updates.contractTypeId !== undefined) {
        employeeSetClauses.push(`tipo_contrato_id = $${employeeParamIndex}`);
        employeeParams.push(updates.contractTypeId);
        employeeParamIndex++;
      }
      if (updates.employeeStatusId !== undefined) {
        employeeSetClauses.push(`estado_empleado_id = $${employeeParamIndex}`);
        employeeParams.push(updates.employeeStatusId);
        employeeParamIndex++;
      }
      if (updates.terminationDate !== undefined) {
        employeeSetClauses.push(`fecha_salida = $${employeeParamIndex}`);
        employeeParams.push(updates.terminationDate);
        employeeParamIndex++;
      }
      if (updates.baseSalary !== undefined) {
        employeeSetClauses.push(`salario_base = $${employeeParamIndex}`);
        employeeParams.push(updates.baseSalary);
        employeeParamIndex++;
      }
      if (updates.supervisorId !== undefined) {
        employeeSetClauses.push(`supervisor_id = $${employeeParamIndex}`);
        employeeParams.push(updates.supervisorId);
        employeeParamIndex++;
      }
      if (updates.assignedZones !== undefined) {
        employeeSetClauses.push(`zonas_asignadas = $${employeeParamIndex}`);
        employeeParams.push(updates.assignedZones);
        employeeParamIndex++;
      }
      if (updates.driverLicense !== undefined) {
        employeeSetClauses.push(`licencia_conducir = $${employeeParamIndex}`);
        employeeParams.push(updates.driverLicense);
        employeeParamIndex++;
      }
      if (updates.hasCompanyVehicle !== undefined) {
        employeeSetClauses.push(
          `tiene_vehiculo_empresa = $${employeeParamIndex}`,
        );
        employeeParams.push(updates.hasCompanyVehicle);
        employeeParamIndex++;
      }
      if (updates.internalPhone !== undefined) {
        employeeSetClauses.push(`telefono_interno = $${employeeParamIndex}`);
        employeeParams.push(updates.internalPhone);
        employeeParamIndex++;
      }
      if (updates.internalEmail !== undefined) {
        employeeSetClauses.push(`email_interno = $${employeeParamIndex}`);
        employeeParams.push(updates.internalEmail);
        employeeParamIndex++;
      }
      if (updates.photoUrl !== undefined) {
        employeeSetClauses.push(`foto_url = $${employeeParamIndex}`);
        employeeParams.push(updates.photoUrl);
        employeeParamIndex++;
      }
      if (updates.metadata !== undefined) {
        employeeSetClauses.push(`metadata = $${employeeParamIndex}`);
        employeeParams.push(updates.metadata);
        employeeParamIndex++;
      }

      if (employeeSetClauses.length === 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'No fields to update',
        });
      }

      // Siempre actualizar auditoría
      employeeSetClauses.push(`updated_at = CURRENT_TIMESTAMP`);
      employeeSetClauses.push(`updated_by = $${employeeParamIndex}`);
      employeeParams.push(updates.updatedBy || null); // O el usuario logueado desde JWT

      const updateEmployeeQuery = `
      UPDATE empleados
      SET ${employeeSetClauses.join(', ')}
      WHERE empleado_id = $${employeeParamIndex + 1}
        AND deleted_at IS NULL
      RETURNING
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
        deleted_at AS deleted_at;
    `;

      employeeParams.push(employeeId);

      const updateResult = await client.query<UserEmployeeSQLResult>(
        updateEmployeeQuery,
        employeeParams,
      );

      if (updateResult.rowCount === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Employee with ID ${employeeId} not found or already deleted`,
        });
      }

      await client.query('COMMIT');

      return UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
        updateResult.rows[0],
      );
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }

  async softDelete(employeeId: string): Promise<void> {
    try {
      if (!employeeId || employeeId.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Employee ID must be provided and non-empty',
        });
      }

      const query = `
        UPDATE empleados
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE empleado_id = $1
          AND deleted_at IS NULL;
      `;

      const result = await this.postgresqlService.query(query, [employeeId]);

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Employee with ID ${employeeId} not found or already deleted`,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async restore(employeeId: string): Promise<UserEmployeeResponse | null> {
    try {
      if (!employeeId || employeeId.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Employee ID must be provided and non-empty',
        });
      }

      const query = `
        UPDATE empleados
        SET deleted_at = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE empleado_id = $1
          AND deleted_at IS NOT NULL
        RETURNING
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
          deleted_at AS deleted_at;
      `;

      const result = await this.postgresqlService.query<UserEmployeeSQLResult>(
        query,
        [employeeId],
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Employee with ID ${employeeId} not found or not deleted`,
        });
      }

      return UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
        result[0],
      );
    } catch (error) {
      throw error;
    }
  }

  async assignZones(employeeId: string, zoneIds: number[]): Promise<void> {
    try {
      if (!employeeId || employeeId.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Employee ID must be provided and non-empty',
        });
      }

      if (!zoneIds || !Array.isArray(zoneIds)) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'zoneIds must be a valid array',
        });
      }

      const query = `
        UPDATE empleados
        SET zonas_asignadas = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE empleado_id = $2
          AND deleted_at IS NULL;
      `;

      await this.postgresqlService.query(query, [zoneIds, employeeId]);
    } catch (error) {
      throw error;
    }
  }

  async changeStatus(
    employeeId: string,
    newStatusId: number,
  ): Promise<UserEmployeeResponse | null> {
    try {
      if (!employeeId || employeeId.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Employee ID must be provided and non-empty',
        });
      }

      const query = `
        UPDATE empleados
        SET estado_empleado_id = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE empleado_id = $2
          AND deleted_at IS NULL
        RETURNING
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
          deleted_at AS deleted_at;
      `;

      const result = await this.postgresqlService.query<UserEmployeeSQLResult>(
        query,
        [newStatusId, employeeId],
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Employee with ID ${employeeId} not found`,
        });
      }

      return UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
        result[0],
      );
    } catch (error) {
      throw error;
    }
  }

  async changeSupervisor(
    employeeId: string,
    supervisorId: string | null,
  ): Promise<UserEmployeeResponse | null> {
    try {
      if (!employeeId || employeeId.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Employee ID must be provided and non-empty',
        });
      }

      const query = `
        UPDATE empleados
        SET supervisor_id = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE empleado_id = $2
          AND deleted_at IS NULL
        RETURNING
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
          deleted_at AS deleted_at;
      `;

      const result = await this.postgresqlService.query<UserEmployeeSQLResult>(
        query,
        [supervisorId, employeeId],
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Employee with ID ${employeeId} not found`,
        });
      }

      return UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
        result[0],
      );
    } catch (error) {
      throw error;
    }
  }

  async findAllActive(): Promise<UserEmployeeResponse[]> {
    try {
      const query = `
        SELECT
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
        FROM empleados
        WHERE estado_empleado_id = 1 AND deleted_at IS NULL
        ORDER BY nombres, apellidos;
      `;

      const result =
        await this.postgresqlService.query<UserEmployeeSQLResult>(query);
      return result.map((row) =>
        UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
          row,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async findByPosition(positionId: number): Promise<UserEmployeeResponse[]> {
    try {
      const query = `
        SELECT
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
        FROM empleados
        WHERE cargo_id = $1
          AND deleted_at IS NULL
        ORDER BY nombres, apellidos;
      `;

      const result = await this.postgresqlService.query<UserEmployeeSQLResult>(
        query,
        [positionId],
      );
      return result.map((row) =>
        UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
          row,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async findByZone(zoneId: number): Promise<UserEmployeeResponse[]> {
    try {
      const query = `
        SELECT
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
        FROM empleados
        WHERE $1 = ANY(zonas_asignadas)
          AND deleted_at IS NULL
        ORDER BY nombres, apellidos;
      `;

      const result = await this.postgresqlService.query<UserEmployeeSQLResult>(
        query,
        [zoneId],
      );
      return result.map((row) =>
        UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
          row,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async findBySupervisor(
    supervisorId: string,
  ): Promise<UserEmployeeResponse[]> {
    try {
      if (!supervisorId || supervisorId.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Supervisor ID must be provided and non-empty',
        });
      }

      const query = `
        SELECT
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
        FROM empleados
        WHERE supervisor_id = $1
          AND deleted_at IS NULL
        ORDER BY nombres, apellidos;
      `;

      const result = await this.postgresqlService.query<UserEmployeeSQLResult>(
        query,
        [supervisorId],
      );
      return result.map((row) =>
        UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
          row,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async findAllEmployees(
    limit: number,
    offset: number,
  ): Promise<UserEmployeeResponse[]> {
    try {
      const query = `
        SELECT
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
        FROM empleados
        WHERE deleted_at IS NULL
        ORDER BY nombres, apellidos
        LIMIT $1 OFFSET $2;
      `;

      const result = await this.postgresqlService.query<UserEmployeeSQLResult>(
        query,
        [limit, offset],
      );
      return result.map((row) =>
        UserEmployeeAdapter.fromUserEmployeeSQLResultToUserEmployeeSQLResponse(
          row,
        ),
      );
    } catch (error) {
      throw error;
    }
  }
}
