import { LogSessionRequest } from '../schemas/dto/request/log-session.request';
import { GetAuditLogsRequest, GetSessionLogsRequest } from '../schemas/dto/request/get-audit-logs.request';
import { AuditRegistroResponse } from '../schemas/dto/response/audit-registro.response';
import { AuditSesionResponse } from '../schemas/dto/response/audit-sesion.response';

export interface InterfaceAuditRepository {
  logSession(request: LogSessionRequest): Promise<void>;
  getAuditLogs(request: GetAuditLogsRequest): Promise<AuditRegistroResponse[]>;
  getSessionLogs(request: GetSessionLogsRequest): Promise<AuditSesionResponse[]>;
}
