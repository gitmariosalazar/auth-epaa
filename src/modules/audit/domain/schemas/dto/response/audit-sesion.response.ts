export interface AuditSesionResponse {
  sessionLogId: number;
  auditTimestamp: Date;
  userId?: string;
  username?: string;
  event: string;
  ipAddress?: string;
  userAgent?: string;
  failureReason?: string;
  metadata?: Record<string, any>;
}
