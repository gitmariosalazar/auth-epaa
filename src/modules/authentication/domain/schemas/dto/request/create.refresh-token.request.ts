/*
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,          -- hash del refresh token (argon2id o bcrypt)
    jti UUID DEFAULT gen_random_uuid() UNIQUE, -- para trazabilidad/revocación (opcional pero recomendado)
    expires_at TIMESTAMPTZ NOT NULL,          -- fecha de expiración (ej: 30–90 días)
    revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMPTZ,
    device_info TEXT,                         -- "Chrome/Windows 11", "iPhone 16", etc.
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ DEFAULT NOW()
);
*/

export class CreateRefreshTokenRequest {
  userId: string;
  expiresInSeconds: number;
  deviceInfo?: string;
  ipAddress?: string;
}
