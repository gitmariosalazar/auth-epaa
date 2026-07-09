import { PositionResponse } from '../schemas/dto/response/rol.response';
import { PositionModel } from '../schemas/models/position.model';

export interface PositionRepository {
  createPosition(position: PositionModel): Promise<PositionResponse>;
  updatePosition(
    positionId: number,
    position: PositionModel,
  ): Promise<PositionResponse>;
  getPositionById(positionId: number): Promise<PositionResponse | null>;
  getAllPositions(): Promise<PositionResponse[]>;
  disablePosition(positionId: number): Promise<boolean>;
  existsByName(name: string): Promise<boolean>;
  findByName(name: string): Promise<PositionResponse | null>;
}
