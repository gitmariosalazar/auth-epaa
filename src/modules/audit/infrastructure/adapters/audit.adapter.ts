import {
  AuditRegistroSQLResult,
  AuditSesionSQLResult,
} from '../interfaces/sql/audit.sql.result';
import { AuditRegistroResponse } from '../../domain/schemas/dto/response/audit-registro.response';
import { AuditSesionResponse } from '../../domain/schemas/dto/response/audit-sesion.response';

export class AuditAdapter {
  static fromAuditRegistroSQLResultToResponse(
    sqlResult: AuditRegistroSQLResult,
  ): AuditRegistroResponse {
    return {
      auditId: Number(sqlResult.audit_id),
      auditTimestamp: sqlResult.audit_timestamp,
      userId: sqlResult.user_id || undefined,
      username: sqlResult.username || undefined,
      ipAddress: sqlResult.ip_address || undefined,
      appName: sqlResult.app_name,
      sessionId: sqlResult.session_id || undefined,
      schemaName: sqlResult.schema_name,
      tableName: sqlResult.table_name,
      operation: sqlResult.operation,
      pkValue: sqlResult.pk_value,
      dataBefore: sqlResult.data_before || undefined,
      dataAfter: sqlResult.data_after || undefined,
      changedFields: sqlResult.changed_fields || [],
      diffJsonb: sqlResult.diff_jsonb || undefined,
      queryHash: sqlResult.query_hash || undefined,
      durationMs: sqlResult.duration_ms
        ? Number(sqlResult.duration_ms)
        : undefined,
      metadata: sqlResult.metadata || undefined,
    };
  }

  static fromAuditSesionSQLResultToResponse(
    sqlResult: AuditSesionSQLResult,
  ): AuditSesionResponse {
    return {
      sessionLogId: Number(sqlResult.session_log_id),
      auditTimestamp: sqlResult.audit_timestamp,
      userId: sqlResult.user_id || undefined,
      username: sqlResult.username || undefined,
      event: sqlResult.event,
      ipAddress: sqlResult.ip_address || undefined,
      userAgent: sqlResult.user_agent || undefined,
      failureReason: sqlResult.failure_reason || undefined,
      metadata: sqlResult.metadata || undefined,
    };
  }
}
