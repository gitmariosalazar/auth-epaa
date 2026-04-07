import { Inject, Injectable } from '@nestjs/common';
import { InterfaceAuditRepository } from '../../domain/contracts/audit.interface.repository';
import { LogSessionRequest } from '../../domain/schemas/dto/request/log-session.request';
import { AuditDomainException } from '../../domain/exceptions/audit.exceptions';

@Injectable()
export class LogSessionUseCase {
  constructor(
    @Inject('AuditRepository')
    private readonly auditRepository: InterfaceAuditRepository,
  ) {}

  async execute(request: LogSessionRequest): Promise<void> {
    if (!request.event) {
      throw new AuditDomainException('El evento de la sesión es requerido.');
    }
    await this.auditRepository.logSession(request);
  }
}
