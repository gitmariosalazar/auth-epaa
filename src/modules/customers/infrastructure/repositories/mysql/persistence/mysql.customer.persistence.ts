import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import {
  DatabaseAbstract,
  IDatabaseClient,
} from '../../../../../../shared/connections/database/abstract/abstract.database';
import { InterfaceCustomerRepository } from '../../../../domain/contracts/customer.interface.repository';
import { CustomerResponse } from '../../../../domain/schemas/dto/response/customer.response';
import { CustomerModel } from '../../../../domain/schemas/models/customer.model';
import {
  CustomerSQLResult,
  UserProfileSQLResult,
} from '../../../interface/sql/customer.sql.result';
import { CustomerAdapter } from '../../../adapters/customer.adapter';
import * as crypto from 'crypto';
import { UserProfileResponse } from '../../../../domain/schemas/dto/response/user-profile.response';

@Injectable()
export class MySQLCustomerPersistence implements InterfaceCustomerRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  private readonly SELECT_ALL_FIELDS = `
    cliente_usuario_id AS customer_user_id,
    cliente_id AS client_id,
    email AS email,
    password_hash AS password_hash,
    auth_method AS auth_method,
    auth_provider AS auth_provider,
    estado_cliente_usuario_id AS customer_status_id,
    failed_attempts AS failed_attempts,
    is_locked_out AS is_locked_out,
    two_factor_enabled AS two_factor_enabled,
    email_verified AS email_verified,
    telefono_verified AS telefono_verified,
    created_at AS created_at,
    updated_at AS updated_at,
    created_by AS created_by,
    updated_by AS updated_by,
    deleted_at AS deleted_at
  `;

  async findById(customerUserId: string): Promise<CustomerResponse | null> {
    const query = `SELECT ${this.SELECT_ALL_FIELDS} FROM cliente_usuario WHERE cliente_usuario_id = ? AND deleted_at IS NULL;`;
    const result = await this.databaseService.query<CustomerSQLResult>(query, [
      customerUserId,
    ]);
    return result.length > 0
      ? CustomerAdapter.fromSQLResultToResponse(result[0])
      : null;
  }

  async findByClientId(clientId: string): Promise<CustomerResponse | null> {
    const query = `SELECT ${this.SELECT_ALL_FIELDS} FROM cliente_usuario WHERE client_id = ? AND deleted_at IS NULL;`;
    const result = await this.databaseService.query<CustomerSQLResult>(query, [
      clientId,
    ]);
    return result.length > 0
      ? CustomerAdapter.fromSQLResultToResponse(result[0])
      : null;
  }

  async findByEmail(email: string): Promise<CustomerResponse | null> {
    const query = `SELECT ${this.SELECT_ALL_FIELDS} FROM cliente_usuario WHERE email = ? AND deleted_at IS NULL;`;
    const result = await this.databaseService.query<CustomerSQLResult>(query, [
      email.trim().toLowerCase(),
    ]);
    return result.length > 0
      ? CustomerAdapter.fromSQLResultToResponse(result[0])
      : null;
  }

  async existsByClientId(clientId: string): Promise<boolean> {
    const query =
      'SELECT 1 FROM cliente_usuario WHERE cliente_id = ? AND deleted_at IS NULL LIMIT 1;';
    const result = await this.databaseService.query<any>(query, [clientId]);
    return result.length > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const query =
      'SELECT 1 FROM cliente_usuario WHERE email = ? AND deleted_at IS NULL LIMIT 1;';
    const result = await this.databaseService.query<any>(query, [
      email.trim().toLowerCase(),
    ]);
    return result.length > 0;
  }

  async create(
    customer: CustomerModel,
    securityData?: { passwordHash?: string },
  ): Promise<CustomerResponse> {
    return await this.databaseService.transaction(
      async (client: IDatabaseClient) => {
        const isCompany =
          customer.clientId.length === 13 &&
          ['6', '9'].includes(customer.clientId[2]);

        // Step 1: Ensure the associated customer exists in cliente
        const clientExistsResult = await client.query<any>(
          'SELECT 1 FROM cliente WHERE cliente_id = ?',
          [customer.clientId],
        );

        if (clientExistsResult.length === 0) {
          const typeId = customer.clientId.length === 13 ? 'RUC' : 'CED';
          await client.query(
            'INSERT INTO cliente (cliente_id, tipo_identificacion_id, cliente_id_valido, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
            [customer.clientId, typeId, 'CED_VALID'],
          );
        }

        if (isCompany) {
          // It's a legal entity (Company/Public RUC). Ensure it exists in empresa
          const empresaExists = await client.query<any>(
            'SELECT 1 FROM empresa WHERE cliente_id = ?',
            [customer.clientId],
          );

          if (empresaExists.length === 0) {
            await client.query(
              `INSERT INTO empresa (
                empresa_id, nombre_comercial, razon_social, ruc, direccion, parroquia_id, cliente_id, pais, created_at, updated_at
               ) VALUES (?, ?, ?, ?, 'SIN DIRECCION', '100252', ?, 'Ecuador', NOW(), NOW())`,
              [
                crypto.randomUUID(),
                customer.nombreComercial ?? 'EMPRESA EXTERNA',
                customer.razonSocial ?? 'EMPRESA EXTERNA S.A.',
                customer.clientId,
                customer.clientId,
              ],
            );
          }
        } else {
          // It's a natural person (Cédula or Natural RUC). Ensure citizen and persona_natural exist
          const citizenId = customer.clientId.substring(0, 10);

          const citizenExists = await client.query<any>(
            'SELECT 1 FROM ciudadano WHERE ciudadano_id = ?',
            [citizenId],
          );

          if (citizenExists.length === 0) {
            await client.query(
              `INSERT INTO ciudadano (
                ciudadano_id, nombres, apellidos, sexo_id, estado_civil_id, profesion_id, parroquia_id, direccion
               ) VALUES (?, ?, ?, 1, 1, 59, '100252', 'SIN DIRECCION')`,
              [
                citizenId,
                customer.firstName ?? 'CLIENTE',
                customer.lastName ?? 'EXTERNO',
              ],
            );
          }

          const naturalLinkExists = await client.query<any>(
            'SELECT 1 FROM cliente_persona_natural WHERE ciudadano_id = ? AND cliente_id = ?',
            [citizenId, customer.clientId],
          );

          if (naturalLinkExists.length === 0) {
            await client.query(
              'INSERT INTO cliente_persona_natural (ciudadano_id, cliente_id, direccion_acometida) VALUES (?, ?, ?)',
              [citizenId, customer.clientId, 'SIN DIRECCION'],
            );
          }
        }

        // Step 4: Insert the cliente_usuario account
        const customerUserId = crypto.randomUUID();
        const insertQuery = `
          INSERT INTO cliente_usuario (
            cliente_usuario_id, cliente_id, email, password_hash, auth_method, auth_provider,
            estado_cliente_usuario_id, failed_attempts, is_locked_out,
            two_factor_enabled, email_verified, telefono_verified,
            created_at, updated_at, created_by, updated_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)
        `;

        const params = [
          customerUserId,
          customer.clientId,
          customer.email.trim().toLowerCase(),
          securityData?.passwordHash ?? customer.passwordHash ?? null,
          customer.authMethod,
          customer.authProvider ?? null,
          customer.customerStatusId,
          customer.failedAttempts,
          customer.isLockedOut,
          customer.twoFactorEnabled,
          customer.emailVerified,
          customer.telefonoVerified,
          customer.createdBy ? customer.createdBy : null,
          customer.updatedBy ? customer.updatedBy : null,
        ];

        await client.query(insertQuery, params);

        const rows = await client.query<CustomerSQLResult>(
          `SELECT ${this.SELECT_ALL_FIELDS} FROM cliente_usuario WHERE cliente_usuario_id = ?`,
          [customerUserId],
        );
        return CustomerAdapter.fromSQLResultToResponse(rows[0]);
      },
    );
  }

  async update(
    customerUserId: string,
    updates: Partial<CustomerModel>,
  ): Promise<CustomerResponse | null> {
    const query = `
      UPDATE cliente_usuario SET 
        email = COALESCE(?, email),
        estado_cliente_usuario_id = COALESCE(?, estado_cliente_usuario_id),
        two_factor_enabled = COALESCE(?, two_factor_enabled),
        email_verified = COALESCE(?, email_verified),
        telefono_verified = COALESCE(?, telefono_verified),
        updated_at = NOW() 
      WHERE cliente_usuario_id = ? AND deleted_at IS NULL
    `;

    await this.databaseService.execute(query, [
      updates.email,
      updates.customerStatusId,
      updates.twoFactorEnabled,
      updates.emailVerified,
      updates.telefonoVerified,
      customerUserId,
    ]);

    return this.findById(customerUserId);
  }

  async softDelete(customerUserId: string): Promise<void> {
    await this.databaseService.execute(
      'UPDATE cliente_usuario SET deleted_at = NOW() WHERE cliente_usuario_id = ?',
      [customerUserId],
    );
  }

  async restore(customerUserId: string): Promise<CustomerResponse | null> {
    await this.databaseService.execute(
      'UPDATE cliente_usuario SET deleted_at = NULL WHERE cliente_usuario_id = ?',
      [customerUserId],
    );
    return this.findById(customerUserId);
  }

  async findAllCustomers(
    limit: number,
    offset: number,
  ): Promise<CustomerResponse[]> {
    const query = `
      SELECT ${this.SELECT_ALL_FIELDS} FROM cliente_usuario 
      WHERE deleted_at IS NULL LIMIT ? OFFSET ?;
    `;
    const result = await this.databaseService.query<CustomerSQLResult>(query, [
      Number(limit),
      Number(offset),
    ]);
    return result.map((row) => CustomerAdapter.fromSQLResultToResponse(row));
  }
  async getProfileByCustomerUserSearchValue(
    searchValue: string,
  ): Promise<UserProfileResponse | null> {
    const query = `
      SELECT
          -- User Data
          cu.cliente_usuario_id AS "user_id",
          cu.cliente_id AS "client_id",
          cu.email AS "email",
          cu.fecha_registro AS "register_date",

          CASE
              WHEN e.ruc IS NOT NULL THEN
                  jsonb_build_object(
                      'company_id', e.empresa_id,
                      'commercial_name', e.nombre_comercial,
                      'business_name', e.razon_social,
                      'ruc', e.ruc,
                      'address', e.direccion,
                      'parish_id', e.parroquia_id,
                      'country', e.pais,
                      'client_id', e.cliente_id,
                      'phones', cc.phones,
                      'emails', cc.correos
                  )
              ELSE NULL
          END AS "company",

          -- Person Data (if applicable)
          CASE
              WHEN ci.ciudadano_id IS NOT NULL THEN
                  jsonb_build_object(
                      'person_id', ci.ciudadano_id,
                      'first_name', ci.nombres,
                      'last_name', ci.apellidos,
                      'birth_date', ci.fecha_nacimiento,
                      'is_deceased', ci.fallecido,
                      'gender_id', ci.sexo_id,
                      'civil_status_id', ci.estado_civil_id,
                      'profession_id', ci.profesion_id,
                      'parish_id', ci.parroquia_id,
                      'address', ci.direccion,
                      'country', ci.pais_origen,
                      'phones', cc.phones,
                      'emails', cc.correos
                  )
              ELSE NULL
          END AS "person",

          -- �Aqu� estaban los errores corregidos!
          CASE
              WHEN ci.ciudadano_id IS NOT NULL THEN 'PERSONA NATURAL'
              WHEN e.ruc IS NOT NULL THEN 'PERSONA JURIDICA'
              ELSE NULL
          END AS "user_type"

      FROM cliente_usuario cu
      LEFT JOIN cliente c ON cu.cliente_id = c.cliente_id
      LEFT JOIN ciudadano ci     ON ci.ciudadano_id = c.cliente_id
      LEFT JOIN empresa e        ON e.ruc = c.cliente_id
      LEFT JOIN cliente_contacto cc ON cc.cliente_id = c.cliente_id
      WHERE cu.email = $1 OR cu.email = $1 OR cu.cliente_usuario_id = $1;
    `;
    const result = await this.databaseService.query<UserProfileSQLResult>(
      query,
      [searchValue, searchValue],
    );
    return result.length > 0
      ? CustomerAdapter.fromUserProfileSQLResultToResponse(result[0])
      : null;
  }
}
