export class CustomerModel {
  private _customerUserId: string;
  private _clientId: string;
  private _email: string;
  private _passwordHash?: string | null;
  private _authMethod: string;
  private _authProvider?: string | null;
  private _customerStatusId: number;
  private _failedAttempts: number;
  private _isLockedOut: boolean;
  private _twoFactorEnabled: boolean;
  private _emailVerified: boolean;
  private _telefonoVerified: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _createdBy?: string | null;
  private _updatedBy?: string | null;
  private _deletedAt?: Date | null;
  private _firstName?: string | null;
  private _lastName?: string | null;
  private _nombreComercial?: string | null;
  private _razonSocial?: string | null;

  constructor(params: {
    customerUserId: string;
    clientId: string;
    email: string;
    passwordHash?: string | null;
    authMethod?: string;
    authProvider?: string | null;
    customerStatusId?: number;
    failedAttempts?: number;
    isLockedOut?: boolean;
    twoFactorEnabled?: boolean;
    emailVerified?: boolean;
    telefonoVerified?: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string | null;
    updatedBy?: string | null;
    deletedAt?: Date | null;
    firstName?: string | null;
    lastName?: string | null;
    nombreComercial?: string | null;
    razonSocial?: string | null;
  }) {
    this._customerUserId = params.customerUserId;
    this._clientId = params.clientId;
    this._email = params.email;
    this._passwordHash = params.passwordHash;
    this._authMethod = params.authMethod ?? 'PASSWORD';
    this._authProvider = params.authProvider;
    this._customerStatusId = params.customerStatusId ?? 2; // Default: PENDING/INACTIVE
    this._failedAttempts = params.failedAttempts ?? 0;
    this._isLockedOut = params.isLockedOut ?? false;
    this._twoFactorEnabled = params.twoFactorEnabled ?? false;
    this._emailVerified = params.emailVerified ?? false;
    this._telefonoVerified = params.telefonoVerified ?? false;
    this._createdAt = params.createdAt;
    this._updatedAt = params.updatedAt;
    this._createdBy = params.createdBy;
    this._updatedBy = params.updatedBy;
    this._deletedAt = params.deletedAt;
    this._firstName = params.firstName;
    this._lastName = params.lastName;
    this._nombreComercial = params.nombreComercial;
    this._razonSocial = params.razonSocial;
  }

  // Getters
  public get customerUserId(): string { return this._customerUserId; }
  public get clientId(): string { return this._clientId; }
  public get email(): string { return this._email; }
  public get passwordHash(): string | null | undefined { return this._passwordHash; }
  public get authMethod(): string { return this._authMethod; }
  public get authProvider(): string | null | undefined { return this._authProvider; }
  public get customerStatusId(): number { return this._customerStatusId; }
  public get failedAttempts(): number { return this._failedAttempts; }
  public get isLockedOut(): boolean { return this._isLockedOut; }
  public get twoFactorEnabled(): boolean { return this._twoFactorEnabled; }
  public get emailVerified(): boolean { return this._emailVerified; }
  public get telefonoVerified(): boolean { return this._telefonoVerified; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }
  public get createdBy(): string | null | undefined { return this._createdBy; }
  public get updatedBy(): string | null | undefined { return this._updatedBy; }
  public get deletedAt(): Date | null | undefined { return this._deletedAt; }
  public get firstName(): string | null | undefined { return this._firstName; }
  public get lastName(): string | null | undefined { return this._lastName; }
  public get nombreComercial(): string | null | undefined { return this._nombreComercial; }
  public get razonSocial(): string | null | undefined { return this._razonSocial; }

  public get isActive(): boolean {
    return this._customerStatusId === 1; // 1 represents ACTIVE state
  }

  // Setters
  public setEmail(email: string): void {
    this._email = email.trim().toLowerCase();
  }

  public setPasswordHash(hash: string): void {
    this._passwordHash = hash;
  }

  public setStatus(statusId: number): void {
    this._customerStatusId = statusId;
  }

  public incrementFailedAttempts(): void {
    this._failedAttempts += 1;
    if (this._failedAttempts >= 5) {
      this._isLockedOut = true;
    }
  }

  public resetFailedAttempts(): void {
    this._failedAttempts = 0;
    this._isLockedOut = false;
  }

  public toJSON(): Record<string, any> {
    return {
      customerUserId: this._customerUserId,
      clientId: this._clientId,
      email: this._email,
      passwordHash: this._passwordHash,
      authMethod: this._authMethod,
      authProvider: this._authProvider,
      customerStatusId: this._customerStatusId,
      isActive: this.isActive,
      failedAttempts: this._failedAttempts,
      isLockedOut: this._isLockedOut,
      twoFactorEnabled: this._twoFactorEnabled,
      emailVerified: this._emailVerified,
      telefonoVerified: this._telefonoVerified,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      createdBy: this._createdBy,
      updatedBy: this._updatedBy,
      deletedAt: this._deletedAt,
      firstName: this._firstName,
      lastName: this._lastName,
      nombreComercial: this._nombreComercial,
      razonSocial: this._razonSocial,
    };
  }
}
