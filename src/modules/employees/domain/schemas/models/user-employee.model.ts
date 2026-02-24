/**
 * Modelo de dominio para empleados (UserEmployeeModel).
 * - Encapsula todos los campos de la tabla `empleados`.
 * - Usa getters para acceso de solo lectura.
 * - Setters públicos controlados solo para campos modificables en update.
 * - Método `withUpdates` para updates inmutables (recomendado).
 */
export class UserEmployeeModel {
  private _employeeId: string;
  private _userId: string;
  private _citizenId?: string | null;
  private _idCard?: string | null;
  private _firstName: string;
  private _lastName: string;
  private _dateOfBirth?: Date | null;
  private _sexId?: number | null;

  private _positionId: number;
  private _contractTypeId: number;
  private _employeeStatusId: number;
  private _hireDate: Date;
  private _terminationDate?: Date | null;
  private _baseSalary?: number | null;
  private _supervisorId?: string | null;

  private _assignedZones: number[];
  private _driverLicense?: string | null;
  private _hasCompanyVehicle: boolean;

  private _internalPhone?: string | null;
  private _internalEmail?: string | null;
  private _photoUrl?: string | null;

  private _metadata: Record<string, any>;

  private _createdAt: Date;
  private _updatedAt: Date;
  private _createdBy?: string | null;
  private _updatedBy?: string | null;
  private _deletedAt?: Date | null;

  constructor(params: {
    employeeId: string;
    userId: string;
    citizenId?: string | null;
    idCard?: string | null;
    firstName: string;
    lastName: string;
    dateOfBirth?: Date | null;
    sexId?: number | null;
    positionId: number;
    contractTypeId: number;
    employeeStatusId: number;
    hireDate: Date;
    terminationDate?: Date | null;
    baseSalary?: number | null;
    supervisorId?: string | null;
    assignedZones?: number[];
    driverLicense?: string | null;
    hasCompanyVehicle?: boolean;
    internalPhone?: string | null;
    internalEmail?: string | null;
    photoUrl?: string | null;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string | null;
    updatedBy?: string | null;
    deletedAt?: Date | null;
  }) {
    this._employeeId = params.employeeId;
    this._userId = params.userId;
    this._citizenId = params.citizenId;
    this._idCard = params.idCard;
    this._firstName = params.firstName;
    this._lastName = params.lastName;
    this._dateOfBirth = params.dateOfBirth;
    this._sexId = params.sexId;

    this._positionId = params.positionId;
    this._contractTypeId = params.contractTypeId;
    this._employeeStatusId = params.employeeStatusId;
    this._hireDate = params.hireDate;
    this._terminationDate = params.terminationDate;
    this._baseSalary = params.baseSalary;
    this._supervisorId = params.supervisorId;

    this._assignedZones = params.assignedZones ?? [];

    this._driverLicense = params.driverLicense;
    this._hasCompanyVehicle = params.hasCompanyVehicle ?? false;

    this._internalPhone = params.internalPhone;
    this._internalEmail = params.internalEmail;
    this._photoUrl = params.photoUrl;

    this._metadata = params.metadata ?? {};

    this._createdAt = params.createdAt;
    this._updatedAt = params.updatedAt;
    this._createdBy = params.createdBy;
    this._updatedBy = params.updatedBy;
    this._deletedAt = params.deletedAt;
  }

  // Getters (solo lectura)

  public get employeeId(): string {
    return this._employeeId;
  }

  public get userId(): string {
    return this._userId;
  }

  public get citizenId(): string | null | undefined {
    return this._citizenId;
  }

  public get idCard(): string | null | undefined {
    return this._idCard;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public get fullName(): string {
    return `${this._firstName} ${this._lastName}`.trim();
  }

  public get dateOfBirth(): Date | null | undefined {
    return this._dateOfBirth;
  }

  public get sexId(): number | null | undefined {
    return this._sexId;
  }

  // ... getters para todos los demás campos (positionId, contractTypeId, etc.)

  public get positionId(): number {
    return this._positionId;
  }

  public get contractTypeId(): number {
    return this._contractTypeId;
  }

  public get employeeStatusId(): number {
    return this._employeeStatusId;
  }

  public get hireDate(): Date {
    return this._hireDate;
  }

  public get terminationDate(): Date | null | undefined {
    return this._terminationDate;
  }

  public get baseSalary(): number | null | undefined {
    return this._baseSalary;
  }

  public get supervisorId(): string | null | undefined {
    return this._supervisorId;
  }

  public get assignedZones(): readonly number[] {
    return [...this._assignedZones];
  }

  public get driverLicense(): string | null | undefined {
    return this._driverLicense;
  }

  public get hasCompanyVehicle(): boolean {
    return this._hasCompanyVehicle;
  }

  public get internalPhone(): string | null | undefined {
    return this._internalPhone;
  }

  public get internalEmail(): string | null | undefined {
    return this._internalEmail;
  }

  public get photoUrl(): string | null | undefined {
    return this._photoUrl;
  }

  public get metadata(): Readonly<Record<string, any>> {
    return { ...this._metadata };
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get createdBy(): string | null | undefined {
    return this._createdBy;
  }

  public get updatedBy(): string | null | undefined {
    return this._updatedBy;
  }

  public get deletedAt(): Date | null | undefined {
    return this._deletedAt;
  }

  public isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  // =============================================
  // Setters controlados (solo para campos modificables en update)
  // =============================================

  public setFirstName(firstName: string): void {
    this._firstName = firstName.trim();
  }

  public setLastName(lastName: string): void {
    this._lastName = lastName.trim();
  }

  public setDateOfBirth(date: Date | null): void {
    this._dateOfBirth = date;
  }

  public setSexId(sexId: number | null): void {
    this._sexId = sexId;
  }

  public setPositionId(positionId: number): void {
    this._positionId = positionId;
  }

  public setContractTypeId(contractTypeId: number): void {
    this._contractTypeId = contractTypeId;
  }

  public setEmployeeStatusId(statusId: number): void {
    this._employeeStatusId = statusId;
  }

  public setBaseSalary(salary: number | null): void {
    this._baseSalary = salary;
  }

  public setSupervisorId(supervisorId: string | null): void {
    this._supervisorId = supervisorId;
  }

  public setAssignedZones(zones: number[]): void {
    this._assignedZones = [...zones];
  }

  public setDriverLicense(license: string | null): void {
    this._driverLicense = license?.trim() ?? null;
  }

  public setHasCompanyVehicle(hasVehicle: boolean): void {
    this._hasCompanyVehicle = hasVehicle;
  }

  public setInternalPhone(phone: string | null): void {
    this._internalPhone = phone?.trim() ?? null;
  }

  public setInternalEmail(email: string | null): void {
    this._internalEmail = email?.trim() ?? null;
  }

  public setPhotoUrl(url: string | null): void {
    this._photoUrl = url?.trim() ?? null;
  }

  public setMetadata(metadata: Record<string, any>): void {
    this._metadata = { ...metadata };
  }

  // Métodos de negocio útiles
  public addZone(zoneId: number): void {
    if (!this._assignedZones.includes(zoneId)) {
      this._assignedZones.push(zoneId);
    }
  }

  public removeZone(zoneId: number): void {
    this._assignedZones = this._assignedZones.filter((id) => id !== zoneId);
  }

  public activate(): void {
    this._employeeStatusId = 1; // ACTIVO
  }

  public deactivate(): void {
    this._employeeStatusId = 6; // RETIRADO o INACTIVO (ajusta según tu tabla)
  }

  public setTerminationDate(date: Date): void {
    if (date < this._hireDate) {
      throw new Error('Termination date cannot be before hire date');
    }
    this._terminationDate = date;
  }

  public toJSON(): Record<string, any> {
    return {
      employeeId: this._employeeId,
      userId: this._userId,
      citizenId: this._citizenId,
      idCard: this._idCard,
      firstName: this._firstName,
      lastName: this._lastName,
      dateOfBirth: this._dateOfBirth,
      sexId: this._sexId,
      positionId: this._positionId,
      contractTypeId: this._contractTypeId,
      employeeStatusId: this._employeeStatusId,
      hireDate: this._hireDate,
      terminationDate: this._terminationDate,
      baseSalary: this._baseSalary,
      supervisorId: this._supervisorId,
      assignedZones: [...this._assignedZones],
      driverLicense: this._driverLicense,
      hasCompanyVehicle: this._hasCompanyVehicle,
      internalPhone: this._internalPhone,
      internalEmail: this._internalEmail,
      photoUrl: this._photoUrl,
      metadata: { ...this._metadata },
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      createdBy: this._createdBy,
      updatedBy: this._updatedBy,
      deletedAt: this._deletedAt,
      isDeleted: this.isDeleted(),
    };
  }
}
