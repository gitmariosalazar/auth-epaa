import { Inject, Injectable } from '@nestjs/common';
import { InterfaceAuditRepository } from '../../domain/contracts/audit.interface.repository';
import { GetSessionLogsRequest } from '../../domain/schemas/dto/request/get-audit-logs.request';
import { AuditSesionResponse } from '../../domain/schemas/dto/response/audit-sesion.response';
import { AuditDomainException } from '../../domain/exceptions/audit.exceptions';

@Injectable()
export class GetSessionLogsUseCase {
  constructor(
    @Inject('AuditRepository')
    private readonly auditRepository: InterfaceAuditRepository,
  ) {}

  async execute(request: GetSessionLogsRequest): Promise<AuditSesionResponse[]> {
    if (request.limit !== undefined && request.limit <= 0) {
      throw new AuditDomainException('El límite debe ser mayor a cero.');
    }
    return await this.auditRepository.getSessionLogs(request);
  }
}
