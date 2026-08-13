export interface AccessTokenPayload {
  sub: string;
  cliente_id?: string;
  user_type?: string;
  username: string;
  email: string;
  roles: string[];
  permissions: number[];
  jti: string;
}

export interface RefreshTokenPayload {
  sub: string;
  username: string;
  jti: string;
}
