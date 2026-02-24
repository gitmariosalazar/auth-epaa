import { Inject, Injectable } from '@nestjs/common';
import { InterfaceRolRepository } from '../../domain/contracts/rol.interface.repository';
import { RolResponse } from '../../domain/schemas/dto/response/rol.response';
import {
  RolDomainException,
  RolNotFoundException,
} from '../../domain/exceptions/rol.exceptions';

@Injectable()
export class FindRolUseCase {
  constructor(
    @Inject('RolRepository')
    private readonly rolRepository: InterfaceRolRepository,
  ) {}

  async findById(rolId: number): Promise<RolResponse> {
    if (isNaN(rolId) || rolId <= 0) {
      throw new RolDomainException('Invalid rol ID');
    }
    const rol = await this.rolRepository.getRolById(rolId);
    if (!rol) {
      throw new RolNotFoundException(rolId.toString());
    }
    return rol;
  }

  async findAll(limit: number, offset: number): Promise<RolResponse[]> {
    if (limit < 0 || offset < 0) {
      throw new RolDomainException('Limit and offset must be positive');
    }
    const rols = await this.rolRepository.getAllRols(limit, offset);
    if (!rols || rols.length === 0) {
      // Original service threw 404 if no roles found. I'll keep that behavior or just return empty?
      // Service threw: statusCode: statusCode.NOT_FOUND, message: 'No rols found'
      // I'll throw strict exception for now to match behavior, or maybe just return empty array?
      // Users findAll returns array. If empty, it's empty array.
      // Roles service threw exception. UseCase usually returns empty array.
      // But preserving behavior is safer. I'll throw exception for now, but commonly findAll should return empty array.
      // Let's standardise to Users module: Users module findAll returns array, doesn't throw if empty usually.
      // Users FindUserUseCase:
      // return await this.userRepository.findAllUsers(limit, offset);
      // It doesn't throw if empty.
      // I'll switch to returning empty array to be "Cleaner". But the original Roles service threw 404.
      // I will return the array. The Controller can decide to throw 404 if it wants (though usually empty list is 200).
      // However, if the key requirement is "Clean Architecture and SOLID ... like Users module", I should copy Users module behavior.
      return rols;
    }
    return rols;
  }

  async findByName(name: string): Promise<RolResponse> {
    if (!name) throw new RolDomainException('Name is required');
    const rol = await this.rolRepository.findByName(name);
    if (!rol) throw new RolNotFoundException(name);
    return rol;
  }
}
