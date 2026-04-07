export interface AuditRegistroResponse {
  auditId: number;
  auditTimestamp: Date;
  userId?: string;
  username?: string;
  ipAddress?: string;
  appName: string;
  sessionId?: string;
  schemaName: string;
  tableName: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE';
  pkValue: Record<string, any>;
  dataBefore?: Record<string, any>;
  dataAfter?: Record<string, any>;
  changedFields: string[];
  diffJsonb?: Record<string, any>;
  queryHash?: string;
  durationMs?: number;
  metadata?: Record<string, any>;
}
