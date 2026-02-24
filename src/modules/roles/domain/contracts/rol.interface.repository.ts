import { RolResponse } from '../schemas/dto/response/rol.response';
import { RolModel } from '../schemas/models/rol.model';

export interface InterfaceRolRepository {
  createRol(rolModel: RolModel): Promise<RolResponse | null>;
  updateRol(rolId: number, rolModel: RolModel): Promise<RolResponse | null>;
  getRolById(rolId: number): Promise<RolResponse | null>;
  getAllRols(limit: number, offset: number): Promise<RolResponse[]>;
  findByName(name: string): Promise<RolResponse | null>;
  existsByName(name: string): Promise<boolean>;
}
