import { CreatePositionRequest } from '../../domain/schemas/dto/request/create-position.request';
import { UpdatePositionRequest } from '../../domain/schemas/dto/request/update-position.request';
import { PositionResponse } from '../../domain/schemas/dto/response/rol.response';
import { PositionModel } from '../../domain/schemas/models/position.model';

export class PositionMapper {
  static fromPositionModelToResponse(model: PositionModel): PositionResponse {
    return {
      positionId: model.getPositionId(),
      name: model.getName(),
      levelJerarchy: model.getLevelJerarchy(),
      description: model.getDescription(),
      isActive: model.getIsActive(),
      creationDate: model.getCreationDate(),
      updatedAt: model.getUpdatedAt(),
    };
  }

  static fromResponseToPositionModel(
    response: PositionResponse,
  ): PositionModel {
    return new PositionModel(
      response.positionId,
      response.name,
      response.levelJerarchy,
      response.isActive,
      response.creationDate,
      response.updatedAt,
      response.description,
    );
  }

  static fromPositionModelsToResponses(
    models: PositionModel[],
  ): PositionResponse[] {
    return models.map((m) => this.fromPositionModelToResponse(m));
  }

  static fromCreateRequestToPositionModel(
    request: CreatePositionRequest,
  ): PositionModel {
    const now = new Date();
    return new PositionModel(
      0,
      request.name,
      request.levelJerarchy,
      true,
      now,
      now,
      request.description,
    );
  }

  static fromUpdateRequestToPositionModel(
    request: UpdatePositionRequest,
    existing: PositionModel,
  ): PositionModel {
    return new PositionModel(
      existing.getPositionId(),
      request.name ?? existing.getName(),
      request.levelJerarchy ?? existing.getLevelJerarchy(),
      request.active !== undefined ? request.active : existing.getIsActive(),
      existing.getCreationDate(),
      new Date(),
      request.description ?? existing.getDescription(),
    );
  }
}
