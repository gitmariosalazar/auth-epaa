import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { PermissionController } from '../../controllers/permission.controller';
import { DatabaseServicePostgreSQL } from '../../../../../shared/connections/database/postgresql/postgresql.service';
import { CreatePermissionUseCase } from '../../../application/usecases/create-permission.usecase';
import { FindPermissionUseCase } from '../../../application/usecases/find-permission.usecase';
import { UpdatePermissionUseCase } from '../../../application/usecases/update-permission.usecase';
import { DeletePermissionUseCase } from '../../../application/usecases/delete-permission.usecase';
import { PermissionPostgreSQLPersistence } from '../../repositories/persistence/postgresql.permission.persistence';
import { GetPermissionsWithCategoryUseCase } from '../../../application/usecases/get-permissions-with-category.usecase';
import { GetPermissionsByCategoryIdUseCase } from '../../../application/usecases/get-permissions-by-categoryid.usecase';
import { GetPermissionSearchAdvancedUseCase } from '../../../application/usecases/get-permission-search-advanced.usecase';

@Module({
  imports: [KafkaServiceModule],
  controllers: [PermissionController],
  providers: [
    DatabaseServicePostgreSQL,
    CreatePermissionUseCase,
    FindPermissionUseCase,
    UpdatePermissionUseCase,
    DeletePermissionUseCase,
    GetPermissionsWithCategoryUseCase,
    GetPermissionsByCategoryIdUseCase,
    GetPermissionSearchAdvancedUseCase,
    {
      provide: 'PermissionRepository',
      useClass: PermissionPostgreSQLPersistence,
    },
  ],
  exports: [],
})
export class PostgreSQLPermissionModule {}
