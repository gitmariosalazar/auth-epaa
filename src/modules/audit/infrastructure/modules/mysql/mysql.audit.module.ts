import { Module } from '@nestjs/common';
import { AuditController } from '../../controllers/audit.controller';
import { LogSessionUseCase } from '../../../application/usecases/log-session.usecase';
import { GetAuditLogsUseCase } from '../../../application/usecases/get-audit-logs.usecase';
import { GetSessionLogsUseCase } from '../../../application/usecases/get-session-logs.usecase';
import { MySQLAuditPersistence } from '../../repositories/mysql/persistence/mysql.audit.persistence';

@Module({
  imports: [],
  controllers: [AuditController],
  providers: [
    
    {
      provide: 'AuditRepository',
      useClass: MySQLAuditPersistence,
    },
    LogSessionUseCase,
    GetAuditLogsUseCase,
    GetSessionLogsUseCase],
  exports: [LogSessionUseCase, GetAuditLogsUseCase, GetSessionLogsUseCase],
})
export class MySQLAuditModule {}
