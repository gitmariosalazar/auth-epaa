export interface RefreshTokenSQLResult {
  id: string;
  usuario_id: string;
  token_hash: string;
  jti: string;
  expires_at: Date;
  revoked: boolean | null | number;
  revoked_at: Date | null;
  device_info: string | null;
  ip_address: string | null;
  created_at: Date;
  last_used_at: Date | null;
}
