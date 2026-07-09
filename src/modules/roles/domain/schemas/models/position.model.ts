export class PositionModel {
  private positionId: number;
  private name: string;
  private levelJerarchy: number;
  private description?: string;
  private isActive: boolean;
  private creationDate: Date;
  private updatedAt: Date;

  constructor(
    positionId: number,
    name: string,
    levelJerarchy: number,
    isActive: boolean,
    creationDate: Date,
    updatedAt: Date,
    description?: string,
  ) {
    this.positionId = positionId;
    this.name = name;
    this.levelJerarchy = levelJerarchy;
    this.description = description;
    this.isActive = isActive;
    this.creationDate = creationDate;
    this.updatedAt = updatedAt;
  }

  public getPositionId(): number {
    return this.positionId;
  }

  public getName(): string {
    return this.name;
  }

  public getLevelJerarchy(): number {
    return this.levelJerarchy;
  }

  public getDescription(): string | undefined {
    return this.description;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setLevelJerarchy(levelJerarchy: number): void {
    this.levelJerarchy = levelJerarchy;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public setIsActive(isActive: boolean): void {
    this.isActive = isActive;
  }
}
