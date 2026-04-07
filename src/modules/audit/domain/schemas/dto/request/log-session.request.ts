export interface LogSessionRequest {
  userId?: string;
  username?: string;
  event: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED';
  ipAddress?: string;
  userAgent?: string;
  failedReason?: string;
  metadata?: Record<string, any>;
}
