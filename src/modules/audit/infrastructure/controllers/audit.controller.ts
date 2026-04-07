import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LogSessionUseCase } from '../../application/usecases/log-session.usecase';
import { GetAuditLogsUseCase } from '../../application/usecases/get-audit-logs.usecase';
import { GetSessionLogsUseCase } from '../../application/usecases/get-session-logs.usecase';
import { LogSessionRequest } from '../../domain/schemas/dto/request/log-session.request';
import { GetAuditLogsRequest, GetSessionLogsRequest } from '../../domain/schemas/dto/request/get-audit-logs.request';

@Controller('audit')
export class AuditController {
  constructor(
    private readonly logSessionUseCase: LogSessionUseCase,
    private readonly getAuditLogsUseCase: GetAuditLogsUseCase,
    private readonly getSessionLogsUseCase: GetSessionLogsUseCase,
  ) {}

  @MessagePattern('audit.log-session')
  async logSession(@Payload() payload: LogSessionRequest) {
    await this.logSessionUseCase.execute(payload);
    return { success: true, message: 'Session logged.' };
  }

  @MessagePattern('audit.get-logs')
  async getAuditLogs(@Payload() payload: GetAuditLogsRequest) {
    return await this.getAuditLogsUseCase.execute(payload);
  }

  @MessagePattern('audit.get-session-logs')
  async getSessionLogs(@Payload() payload: GetSessionLogsRequest) {
    return await this.getSessionLogsUseCase.execute(payload);
  }
}
