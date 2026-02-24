import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { RolPermissionController } from '../../controllers/rol-permission.controller';
import { DatabaseServicePostgreSQL } from '../../../../../shared/connections/database/postgresql/postgresql.service';
import { CreateRolPermissionUseCase } from '../../../application/usecases/create-rol-permission.usecase';
import { FindRolPermissionUseCase } from '../../../application/usecases/find-rol-permission.usecase';
import { UpdateRolPermissionUseCase } from '../../../application/usecases/update-rol-permission.usecase';
import { DeleteRolPermissionUseCase } from '../../../application/usecases/delete-rol-permission.usecase';
import { RolPermissionPostgreSQLPersistence } from '../../repositories/postgresql/persistence/postgresql.rol-permission.persistence';

@Module({
  imports: [KafkaServiceModule],
  controllers: [RolPermissionController],
  providers: [
    DatabaseServicePostgreSQL,
    CreateRolPermissionUseCase,
    FindRolPermissionUseCase,
    UpdateRolPermissionUseCase,
    DeleteRolPermissionUseCase,
    {
      provide: 'RolPermissionRepository',
      useClass: RolPermissionPostgreSQLPersistence,
    },
  ],
})
export class PostgresqlRolPermissionModule {}
