import { AuditRegistroSQLResult, AuditSesionSQLResult } from '../../../interfaces/sql/audit.sql.result';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { Injectable } from '@nestjs/common';
import { InterfaceAuditRepository } from '../../../../domain/contracts/audit.interface.repository';
import { LogSessionRequest } from '../../../../domain/schemas/dto/request/log-session.request';
import {
  GetAuditLogsRequest,
  GetSessionLogsRequest,
} from '../../../../domain/schemas/dto/request/get-audit-logs.request';
import { AuditRegistroResponse } from '../../../../domain/schemas/dto/response/audit-registro.response';
import { AuditSesionResponse } from '../../../../domain/schemas/dto/response/audit-sesion.response';
import { AuditAdapter } from '../../../adapters/audit.adapter';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';

@Injectable()
export class PostgreSQLAuditPersistence implements InterfaceAuditRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async logSession(request: LogSessionRequest): Promise<void> {
    try {
      const query = `
        SELECT audit.fn_registrar_acceso(
          $1::UUID, $2::TEXT, $3::TEXT, $4::INET, $5::TEXT, $6::TEXT, $7::JSONB
        );
      `;
      const params = [
        request.userId || null,
        request.username || null,
        request.event,
        request.ipAddress || null,
        request.userAgent || null,
        request.failedReason || null,
        request.metadata ? JSON.stringify(request.metadata) : '{}',
      ];
      await this.databaseService.query(query, params);
    } catch (error) {
      throw error;
    }
  }

  async getAuditLogs(
    request: GetAuditLogsRequest,
  ): Promise<AuditRegistroResponse[]> {
    try {
      let query = `
        SELECT 
          audit_id AS audit_id, 
          audit_timestamp AS audit_timestamp, 
          usuario_id AS user_id, 
          usuario_nombre AS username, 
          ip_address AS ip_address, 
          app_nombre AS app_name, 
          sesion_id AS session_id, 
          schema_nombre AS schema_name, 
          tabla_nombre AS table_name, 
          operacion AS operation, 
          pk_valor AS pk_value, 
          datos_antes AS data_before, 
          datos_despues AS data_after, 
          campos_cambiados AS changed_fields, 
          diff_jsonb AS diff_jsonb, 
          query_hash AS query_hash, 
          duracion_ms AS duration_ms, 
          metadata AS metadata
        FROM audit.registro
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramIndex = 1;

      if (request.tableName) {
        query += ` AND tabla_nombre = $${paramIndex++}`;
        params.push(request.tableName);
      }
      if (request.operation) {
        query += ` AND operacion = $${paramIndex++}`;
        params.push(request.operation);
      }
      if (request.userId) {
        query += ` AND usuario_id = $${paramIndex++}`;
        params.push(request.userId);
      }
      if (request.username) {
        query += ` AND usuario_nombre = $${paramIndex++}`;
        params.push(request.username);
      }

      query += ` ORDER BY audit_timestamp DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
      params.push(request.limit || 100);
      params.push(request.offset || 0);

      const result = await this.databaseService.query<AuditRegistroSQLResult>(
        query,
        params,
      );
      return result.map((row) =>
        AuditAdapter.fromAuditRegistroSQLResultToResponse(row),
      );
    } catch (error) {
      throw error;
    }
  }

  async getSessionLogs(
    request: GetSessionLogsRequest,
  ): Promise<AuditSesionResponse[]> {
    try {
      let query = `
        SELECT 
          sesion_log_id AS session_log_id, 
          audit_timestamp AS audit_timestamp, 
          usuario_id AS user_id, 
          usuario_nombre AS username, 
          evento AS event, 
          ip_address AS ip_address, 
          user_agent AS user_agent, 
          motivo_fallo AS failure_reason, 
          metadata AS metadata
        FROM audit.sesion
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramIndex = 1;

      if (request.userId) {
        query += ` AND usuario_id = $${paramIndex++}`;
        params.push(request.userId);
      }
      if (request.username) {
        query += ` AND usuario_nombre = $${paramIndex++}`;
        params.push(request.username);
      }
      if (request.event) {
        query += ` AND evento = $${paramIndex++}`;
        params.push(request.event);
      }

      query += ` ORDER BY audit_timestamp DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
      params.push(request.limit || 100);
      params.push(request.offset || 0);

      const result = await this.databaseService.query<AuditSesionSQLResult>(
        query,
        params,
      );
      return result.map((row) =>
        AuditAdapter.fromAuditSesionSQLResultToResponse(row),
      );
    } catch (error) {
      throw error;
    }
  }
}
