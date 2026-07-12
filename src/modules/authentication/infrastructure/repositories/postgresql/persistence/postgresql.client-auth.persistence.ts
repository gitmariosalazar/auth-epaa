import { Injectable } from '@nestjs/common';
import { InterfaceClientAuthRepository } from '../../../../domain/contracts/client-auth.interface.repository';
import { ClientUserModel } from '../../../../domain/schemas/models/client-user.model';
import { RefreshTokenModel } from '../../../../domain/schemas/models/refresh-token.model';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { AuthSQLResult } from '../../../interfaces/sql/auth.sql.result';

@Injectable()
export class PostgreSQLClientAuthPersistence implements InterfaceClientAuthRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async findClientByEmail(email: string): Promise<ClientUserModel | null> {
    const query = `
      SELECT 
        cu.cliente_usuario_id, 
        cu.cliente_id, 
        cu.email, 
        cu.password_hash, 
        cu.estado_cliente_usuario_id, 
        cu.is_active, 
        cu.is_locked_out, 
        cu.lockout_until,
        ci.nombres          AS nombres,
        ci.apellidos        AS apellidos,
        emp.razon_social    AS razon_social,
        emp.nombre_comercial AS nombre_comercial
      FROM public.cliente_usuario cu
      LEFT JOIN public.empresa emp ON emp.cliente_id = cu.cliente_id
      LEFT JOIN public.cliente_persona_natural cpn ON cpn.cliente_id = cu.cliente_id AND emp.cliente_id IS NULL
      LEFT JOIN public.ciudadano ci ON ci.ciudadano_id = cpn.ciudadano_id
      WHERE cu.email = $1 AND cu.deleted_at IS NULL
    `;
    const result = await this.databaseService.query<any>(query, [email]);
    if (result.length === 0) return null;

    const row = result[0];
    const clientUser = new ClientUserModel();
    clientUser.clientUserId = row.cliente_usuario_id;
    clientUser.clienteId = row.cliente_id;
    clientUser.email = row.email;
    clientUser.passwordHash = row.password_hash;
    clientUser.estadoClienteUsuarioId = row.estado_cliente_usuario_id;
    clientUser.isActive = Boolean(row.is_active);
    clientUser.isLockedOut = Boolean(row.is_locked_out);
    clientUser.lockoutUntil = row.lockout_until
      ? new Date(row.lockout_until)
      : undefined;

    // Determinar nombre y apellido según si es persona natural o empresa
    if (row.nombres) {
      clientUser.firstName = row.nombres;
      clientUser.lastName = row.apellidos || '';
    } else if (row.razon_social) {
      clientUser.firstName = row.razon_social;
      clientUser.lastName = row.nombre_comercial || 'Empresa';
    } else {
      // Fallback
      clientUser.firstName = email.split('@')[0];
      clientUser.lastName = 'Cliente';
    }

    return clientUser;
  }

  async findClientByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<ClientUserModel | null> {
    const query = `
      SELECT
        cu.cliente_usuario_id,
        cu.cliente_id,
        cu.email,
        cu.password_hash,
        cu.estado_cliente_usuario_id,
        cu.is_active,
        cu.is_locked_out,
        cu.lockout_until,
        -- Roles
        COALESCE(
            (SELECT jsonb_agg(jsonb_build_object('id', r.rol_id, 'name', r.nombre))
            FROM cliente_usuario_roles ur2
            JOIN roles r ON r.rol_id = ur2.rol_id
            WHERE ur2.cliente_usuario_id = cu.cliente_usuario_id),
            '[]'::jsonb
        )::json AS roles,
        ci.nombres          AS nombres,
        ci.apellidos        AS apellidos,
        emp.razon_social    AS razon_social,
        emp.nombre_comercial AS nombre_comercial
      FROM public.cliente_usuario cu
      LEFT JOIN public.empresa emp ON emp.cliente_id = cu.cliente_id
      LEFT JOIN public.cliente_persona_natural cpn ON cpn.cliente_id = cu.cliente_id AND emp.cliente_id IS NULL
      LEFT JOIN public.ciudadano ci ON ci.ciudadano_id = cpn.ciudadano_id
      WHERE (cu.email = $1 OR cu.cliente_id = $1) AND cu.deleted_at IS NULL
    `;
    const result = await this.databaseService.query<any>(query, [
      usernameOrEmail,
    ]);
    if (result.length === 0) return null;

    const row = result[0];
    const clientUser = new ClientUserModel();
    clientUser.clientUserId = row.cliente_usuario_id;
    clientUser.clienteId = row.cliente_id;
    clientUser.email = row.email;
    clientUser.passwordHash = row.password_hash;
    clientUser.estadoClienteUsuarioId = row.estado_cliente_usuario_id;
    clientUser.isActive = Boolean(row.is_active);
    clientUser.isLockedOut = Boolean(row.is_locked_out);
    clientUser.lockoutUntil = row.lockout_until
      ? new Date(row.lockout_until)
      : undefined;

    // Determinar nombre y apellido según si es persona natural o empresa
    if (row.nombres) {
      clientUser.firstName = row.nombres;
      clientUser.lastName = row.apellidos || '';
    } else if (row.razon_social) {
      clientUser.firstName = row.razon_social;
      clientUser.lastName = row.nombre_comercial || 'Empresa';
    } else {
      // Fallback
      clientUser.firstName = usernameOrEmail.split('@')[0];
      clientUser.lastName = 'Cliente';
    }

    clientUser.roles = Array.isArray(row.roles) ? row.roles : [];

    return clientUser;
  }

  async findClientById(id: string): Promise<ClientUserModel | null> {
    const query = `
      SELECT 
        cu.cliente_usuario_id, 
        cu.cliente_id, 
        cu.email, 
        cu.password_hash, 
        cu.estado_cliente_usuario_id, 
        cu.is_active, 
        cu.is_locked_out, 
        cu.lockout_until,
        ci.nombres          AS nombres,
        ci.apellidos        AS apellidos,
        emp.razon_social    AS razon_social,
        emp.nombre_comercial AS nombre_comercial
      FROM public.cliente_usuario cu
      LEFT JOIN public.empresa emp ON emp.cliente_id = cu.cliente_id
      LEFT JOIN public.cliente_persona_natural cpn ON cpn.cliente_id = cu.cliente_id AND emp.cliente_id IS NULL
      LEFT JOIN public.ciudadano ci ON ci.ciudadano_id = cpn.ciudadano_id
      WHERE cu.cliente_usuario_id = $1 AND cu.deleted_at IS NULL
    `;
    const result = await this.databaseService.query<any>(query, [id]);
    if (result.length === 0) return null;

    const row = result[0];
    const clientUser = new ClientUserModel();
    clientUser.clientUserId = row.cliente_usuario_id;
    clientUser.clienteId = row.cliente_id;
    clientUser.email = row.email;
    clientUser.passwordHash = row.password_hash;
    clientUser.estadoClienteUsuarioId = row.estado_cliente_usuario_id;
    clientUser.isActive = Boolean(row.is_active);
    clientUser.isLockedOut = Boolean(row.is_locked_out);
    clientUser.lockoutUntil = row.lockout_until
      ? new Date(row.lockout_until)
      : undefined;

    // Determinar nombre y apellido según si es persona natural o empresa
    if (row.nombres) {
      clientUser.firstName = row.nombres;
      clientUser.lastName = row.apellidos || '';
    } else if (row.razon_social) {
      clientUser.firstName = row.razon_social;
      clientUser.lastName = row.nombre_comercial || 'Empresa';
    } else {
      // Fallback
      clientUser.firstName = row.email.split('@')[0];
      clientUser.lastName = 'Cliente';
    }

    return clientUser;
  }

  async storeRefreshToken(refreshToken: RefreshTokenModel): Promise<boolean> {
    const query = `
      INSERT INTO audit.usuario_refresh_tokens (
        usuario_id, token_hash, jti, expires_at, ip_address, device_info
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await this.databaseService.query<AuthSQLResult>(query, [
      refreshToken.getUserId(),
      refreshToken.getTokenHash(),
      refreshToken.getJti(),
      refreshToken.getExpiresAt(),
      refreshToken.getIpAddress(),
      refreshToken.getDeviceInfo(),
    ]);
    return true;
  }

  async logClientAccess(
    clientUserId: string | null,
    email: string,
    event: string,
    ip: string,
    userAgent: string,
    reason: string | null = null,
  ): Promise<void> {
    try {
      await this.databaseService.query(
        `SELECT audit.fn_registrar_acceso($1, $2, $3, $4, $5, $6)`,
        [clientUserId, email, event, ip, userAgent, reason],
      );
    } catch (error) {
      console.error('Error logging client access audit:', error);
    }
  }
}
