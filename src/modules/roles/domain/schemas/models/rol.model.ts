/*


CREATE TABLE roles (
    rol_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    parent_rol_id INTEGER REFERENCES roles(rol_id),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

*/

export class RolModel {
  private rolId: number;
  private name: string;
  private description?: string;
  private parentRolId?: number;
  private isActive: boolean;
  private creationDate: Date;

  constructor(
    rolId: number,
    name: string,
    isActive: boolean,
    creationDate: Date,
    description?: string,
    parentRolId?: number,
  ) {
    this.rolId = rolId;
    this.name = name;
    this.description = description;
    this.parentRolId = parentRolId;
    this.isActive = isActive;
    this.creationDate = creationDate;
  }

  // Getters and setters can be added here as needed
  public getRolId(): number {
    return this.rolId;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string | undefined {
    return this.description;
  }

  public getParentRolId(): number | undefined {
    return this.parentRolId;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }

  // Setters can be added as needed
  public setName(name: string): void {
    this.name = name;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public setParentRolId(parentRolId: number): void {
    this.parentRolId = parentRolId;
  }

  public setIsActive(isActive: boolean): void {
    this.isActive = isActive;
  }

  public setCreationDate(creationDate: Date): void {
    this.creationDate = creationDate;
  }

  public toJSON(): object {
    return {
      rolId: this.rolId,
      name: this.name,
      description: this.description,
      parentRolId: this.parentRolId,
      isActive: this.isActive,
      creationDate: this.creationDate,
    };
  }
}
