export interface RolResponse {
  rolId: number;
  name: string;
  description?: string;
  parentRolId?: number;
  isActive: boolean;
  creationDate: Date;
}

export interface PositionResponse {
  positionId: number;
  name: string;
  levelJerarchy: number;
  description?: string;
  isActive: boolean;
  creationDate: Date;
  updatedAt: Date;
}
