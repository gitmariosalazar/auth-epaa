export interface GetAuditLogsRequest {
  limit?: number;
  offset?: number;
  tableName?: string;
  operation?: 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE';
  userId?: string;
  username?: string;
}

export interface GetSessionLogsRequest {
  limit?: number;
  offset?: number;
  userId?: string;
  username?: string;
  event?: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED';
}
