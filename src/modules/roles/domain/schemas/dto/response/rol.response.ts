export interface RolResponse {
  rolId: number;
  name: string;
  description?: string;
  parentRolId?: number;
  isActive: boolean;
  creationDate: Date;
}
