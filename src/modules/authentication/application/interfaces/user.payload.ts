export interface AccessTokenPayload {
  sub: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface RefreshTokenPayload {
  sub: string;
  username: string;
  jti: string;
}
