import { CreateRolRequest } from '../../domain/schemas/dto/request/create.rol.request';
import { UpdateRolRequest } from '../../domain/schemas/dto/request/update.rol.request';
import { RolResponse } from '../../domain/schemas/dto/response/rol.response';
import { RolModel } from '../../domain/schemas/models/rol.model';

export class RolMapper {
  static fromRolModelToResponse(rolModel: RolModel): RolResponse {
    return {
      rolId: rolModel.getRolId(),
      name: rolModel.getName(),
      description: rolModel.getDescription(),
      parentRolId: rolModel.getParentRolId(),
      isActive: rolModel.getIsActive(),
      creationDate: rolModel.getCreationDate(),
    };
  }

  static fromResponseToRolModel(rolResponse: RolResponse): RolModel {
    return new RolModel(
      rolResponse.rolId,
      rolResponse.name,
      rolResponse.isActive,
      rolResponse.creationDate,
      rolResponse.description,
      rolResponse.parentRolId,
    );
  }

  static fromRolModelsToResponses(rolModels: RolModel[]): RolResponse[] {
    return rolModels.map((rolModel) => this.fromRolModelToResponse(rolModel));
  }

  static fromResponsesToRolModels(rolResponses: RolResponse[]): RolModel[] {
    return rolResponses.map((rolResponse) =>
      this.fromResponseToRolModel(rolResponse),
    );
  }

  static fromCreateRolRequestToRolModel(rol: CreateRolRequest): RolModel {
    return new RolModel(
      0,
      rol.name,
      true,
      new Date(),
      rol.description,
      rol.parentRolId,
    );
  }

  static fromUpdateRolRequestToRolModel(
    rolRequest: UpdateRolRequest,
    existingRolModel: RolModel,
  ): RolModel {
    const updatedName = rolRequest.name ?? existingRolModel.getName();
    const updatedDescription =
      rolRequest.description ?? existingRolModel.getDescription();
    const updatedIsActive =
      rolRequest.active !== undefined
        ? rolRequest.active
        : existingRolModel.getIsActive();

    return new RolModel(
      existingRolModel.getRolId(),
      updatedName,
      updatedIsActive,
      existingRolModel.getCreationDate(),
      updatedDescription,
      existingRolModel.getParentRolId(),
    );
  }
}
