import { Module } from '@nestjs/common';
import { PostgreSQLAuditPersistence } from '../../repositories/postgresql/persistence/postgresql.audit.persistence';
import { AuditController } from '../../controllers/audit.controller';
import { LogSessionUseCase } from '../../../application/usecases/log-session.usecase';
import { GetAuditLogsUseCase } from '../../../application/usecases/get-audit-logs.usecase';
import { GetSessionLogsUseCase } from '../../../application/usecases/get-session-logs.usecase';

@Module({
  imports: [],
  controllers: [AuditController],
  providers: [
    
    {
      provide: 'AuditRepository',
      useClass: PostgreSQLAuditPersistence,
    },
    LogSessionUseCase,
    GetAuditLogsUseCase,
    GetSessionLogsUseCase],
  exports: [LogSessionUseCase, GetAuditLogsUseCase, GetSessionLogsUseCase],
})
export class PostgreSQLAuditModule {}
