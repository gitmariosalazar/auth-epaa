export class RefreshTokenModel {
  private id: string;
  private userId: string;
  private tokenHash: string; // ← SOLO ESTO (hash con argon2id)
  private jti?: string; // UUID para trazabilidad/revocación selectiva
  private expiresAt: Date;
  private revoked: boolean;
  private revokedAt?: Date | null;
  private deviceInfo?: string | null;
  private ipAddress?: string | null;
  private createdAt: Date;
  private lastUsedAt: Date;

  constructor(props: {
    id: string;
    userId: string;
    tokenHash: string; // hash, nunca plano
    jti?: string;
    expiresAt: Date;
    revoked: boolean;
    revokedAt?: Date | null;
    deviceInfo?: string | null;
    ipAddress?: string | null;
    createdAt: Date;
    lastUsedAt: Date;
  }) {
    this.id = props.id;
    this.userId = props.userId;
    this.tokenHash = props.tokenHash;
    this.jti = props.jti;
    this.expiresAt = props.expiresAt;
    this.revoked = props.revoked;
    this.revokedAt = props.revokedAt;
    this.deviceInfo = props.deviceInfo;
    this.ipAddress = props.ipAddress;
    this.createdAt = props.createdAt;
    this.lastUsedAt = props.lastUsedAt;
  }

  // Getters and setters can be added here as needed
  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getTokenHash(): string {
    return this.tokenHash;
  }

  public getJti(): string | undefined {
    return this.jti;
  }

  public getExpiresAt(): Date {
    return this.expiresAt;
  }

  public isRevoked(): boolean {
    return this.revoked;
  }

  public getRevokedAt(): Date | null | undefined {
    return this.revokedAt;
  }

  public getDeviceInfo(): string | null | undefined {
    return this.deviceInfo;
  }

  public getIpAddress(): string | null | undefined {
    return this.ipAddress;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getLastUsedAt(): Date {
    return this.lastUsedAt;
  }

  public revoke(revokedAt: Date): void {
    this.revoked = true;
    this.revokedAt = revokedAt;
  }

  public updateLastUsedAt(date: Date): void {
    this.lastUsedAt = date;
  }

  public setDeviceInfo(deviceInfo: string): void {
    this.deviceInfo = deviceInfo;
  }

  public setIpAddress(ipAddress: string): void {
    this.ipAddress = ipAddress;
  }

  public setExpiresAt(expiresAt: Date): void {
    this.expiresAt = expiresAt;
  }

  public setTokenHash(tokenHash: string): void {
    this.tokenHash = tokenHash;
  }

  public setJti(jti: string): void {
    this.jti = jti;
  }

  public setRevoked(revoked: boolean): void {
    this.revoked = revoked;
  }

  public setRevokedAt(revokedAt: Date | null): void {
    this.revokedAt = revokedAt;
  }

  public setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  public setLastUsedAt(lastUsedAt: Date): void {
    this.lastUsedAt = lastUsedAt;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public setDeviceInfoNullable(deviceInfo: string | null): void {
    this.deviceInfo = deviceInfo;
  }

  public setIpAddressNullable(ipAddress: string | null): void {
    this.ipAddress = ipAddress;
  }

  public toJSON(): object {
    return {
      id: this.id,
      userId: this.userId,
      jti: this.jti,
      expiresAt: this.expiresAt,
      revoked: this.revoked,
      revokedAt: this.revokedAt,
      deviceInfo: this.deviceInfo,
      ipAddress: this.ipAddress,
      createdAt: this.createdAt,
      lastUsedAt: this.lastUsedAt,
    };
  }
}
