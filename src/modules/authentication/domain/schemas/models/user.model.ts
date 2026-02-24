/*

CREATE TABLE usuarios (
    usuario_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    failed_attempts INTEGER NOT NULL DEFAULT 0 CHECK (failed_attempts >= 0),
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    observaciones VARCHAR(255)
);
*/

export class UserModel {
  private userId: string;
  private username: string;
  private passwordHash: string;
  private email: string;
  private registrationDate: Date;
  private lastLogin?: Date;
  private failedAttempts: number;
  private twoFactorEnabled: boolean;
  private isActive: boolean;
  private observations?: string;

  constructor(
    userId: string,
    username: string,
    passwordHash: string,
    email: string,
    registrationDate: Date,
    failedAttempts: number,
    twoFactorEnabled: boolean,
    isActive: boolean,
    lastLogin?: Date,
    observations?: string,
  ) {
    this.userId = userId;
    this.username = username;
    this.passwordHash = passwordHash;
    this.email = email;
    this.registrationDate = registrationDate;
    this.lastLogin = lastLogin;
    this.failedAttempts = failedAttempts;
    this.twoFactorEnabled = twoFactorEnabled;
    this.isActive = isActive;
    this.observations = observations;
  }

  // Getters and setters can be added here as needed
  public getUserId(): string {
    return this.userId;
  }

  public getUsername(): string {
    return this.username;
  }

  public getPasswordHash(): string {
    return this.passwordHash;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRegistrationDate(): Date {
    return this.registrationDate;
  }

  public getLastLogin(): Date | undefined {
    return this.lastLogin;
  }

  public getFailedAttempts(): number {
    return this.failedAttempts;
  }

  public isTwoFactorEnabled(): boolean {
    return this.twoFactorEnabled;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getObservations(): string | undefined {
    return this.observations;
  }

  // Setters can be added similarly if needed
  public setLastLogin(lastLogin: Date): void {
    this.lastLogin = lastLogin;
  }

  public setFailedAttempts(failedAttempts: number): void {
    this.failedAttempts = failedAttempts;
  }

  public setIsActive(isActive: boolean): void {
    this.isActive = isActive;
  }

  public setObservations(observations: string): void {
    this.observations = observations;
  }

  public incrementFailedAttempts(): void {
    this.failedAttempts += 1;
  }

  public resetFailedAttempts(): void {
    this.failedAttempts = 0;
  }
}
