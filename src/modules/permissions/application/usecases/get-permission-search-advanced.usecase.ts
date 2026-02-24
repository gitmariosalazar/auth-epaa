import { Inject, Injectable } from '@nestjs/common';
import { InterfacePermissionRepository } from '../../domain/contracts/permission.interface.repository';
import { PermissionResponse } from '../../domain/schemas/dto/response/permission.response';

@Injectable()
export class GetPermissionSearchAdvancedUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: InterfacePermissionRepository,
  ) {}

  async execute(search: string): Promise<PermissionResponse[]> {
    try {
      if (!search) {
        throw new Error('Search is required');
      }
      const response =
        await this.permissionRepository.getPermissionSearchAdvanced(search);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
