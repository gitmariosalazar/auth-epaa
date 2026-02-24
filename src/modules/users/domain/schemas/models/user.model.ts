export class UserModel {
  private userId: string;
  private username: string;
  private passwordHash: string;
  private email: string;
  private registrationDate: Date;
  private lastLogin: Date | null;
  private failedAttempts: number;
  private twoFactorEnabled: boolean;
  private isActive: boolean;
  private observations: string | null;

  constructor(
    userId: string,
    username: string,
    passwordHash: string,
    email: string,
    registrationDate: Date,
    lastLogin: Date | null,
    failedAttempts: number,
    twoFactorEnabled: boolean,
    isActive: boolean,
    observations: string | null,
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

  // Getters and Setters
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

  public getLastLogin(): Date | null {
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

  public getObservations(): string | null {
    return this.observations;
  }

  public setLastLogin(lastLogin: Date | null): void {
    this.lastLogin = lastLogin;
  }

  public setFailedAttempts(failedAttempts: number): void {
    this.failedAttempts = failedAttempts;
  }

  public setTwoFactorEnabled(twoFactorEnabled: boolean): void {
    this.twoFactorEnabled = twoFactorEnabled;
  }

  public setIsActive(isActive: boolean): void {
    this.isActive = isActive;
  }

  public setObservations(observations: string | null): void {
    this.observations = observations;
  }

  public setPasswordHash(passwordHash: string): void {
    this.passwordHash = passwordHash;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public setUsername(username: string): void {
    this.username = username;
  }

  public setRegistrationDate(registrationDate: Date): void {
    this.registrationDate = registrationDate;
  }

  public incrementFailedAttempts(): void {
    this.failedAttempts += 1;
  }

  public resetFailedAttempts(): void {
    this.failedAttempts = 0;
  }

  public enableTwoFactor(): void {
    this.twoFactorEnabled = true;
  }

  public disableTwoFactor(): void {
    this.twoFactorEnabled = false;
  }

  public activateUser(): void {
    this.isActive = true;
  }

  public deactivateUser(): void {
    this.isActive = false;
  }

  public toJSON(): object {
    return {
      userId: this.userId,
      username: this.username,
      email: this.email,
      registrationDate: this.registrationDate,
      lastLogin: this.lastLogin,
      failedAttempts: this.failedAttempts,
      twoFactorEnabled: this.twoFactorEnabled,
      isActive: this.isActive,
      observations: this.observations,
    };
  }
}
