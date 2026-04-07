export interface AuditRegistroSQLResult {
  audit_id: string;
  audit_timestamp: Date;
  user_id: string | null;
  username: string | null;
  ip_address: string | null;
  app_name: string;
  session_id: string | null;
  schema_name: string;
  table_name: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE';
  pk_value: Record<string, any>;
  data_before: Record<string, any> | null;
  data_after: Record<string, any> | null;
  changed_fields: string[];
  diff_jsonb: Record<string, any> | null;
  query_hash: string | null;
  duration_ms: number | null;
  metadata: Record<string, any> | null;
}

export interface AuditSesionSQLResult {
  session_log_id: string;
  audit_timestamp: Date;
  user_id: string | null;
  username: string | null;
  event: string;
  ip_address: string | null;
  user_agent: string | null;
  failure_reason: string | null;
  metadata: Record<string, any> | null;
}
