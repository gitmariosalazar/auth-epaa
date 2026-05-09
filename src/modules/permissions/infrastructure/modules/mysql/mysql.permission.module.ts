import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { PermissionController } from '../../controllers/permission.controller';
import { CreatePermissionUseCase } from '../../../application/usecases/create-permission.usecase';
import { FindPermissionUseCase } from '../../../application/usecases/find-permission.usecase';
import { UpdatePermissionUseCase } from '../../../application/usecases/update-permission.usecase';
import { DeletePermissionUseCase } from '../../../application/usecases/delete-permission.usecase';

import { GetPermissionsWithCategoryUseCase } from '../../../application/usecases/get-permissions-with-category.usecase';
import { GetPermissionsByCategoryIdUseCase } from '../../../application/usecases/get-permissions-by-categoryid.usecase';
import { GetPermissionSearchAdvancedUseCase } from '../../../application/usecases/get-permission-search-advanced.usecase';
import { PermissionMySQLPersistence } from '../../repositories/mysql/persistence/mysql.permission.persistence';

@Module({
  imports: [KafkaServiceModule],
  controllers: [PermissionController],
  providers: [
    
    CreatePermissionUseCase,
    FindPermissionUseCase,
    UpdatePermissionUseCase,
    DeletePermissionUseCase,
    GetPermissionsWithCategoryUseCase,
    GetPermissionsByCategoryIdUseCase,
    GetPermissionSearchAdvancedUseCase,
    {
      provide: 'PermissionRepository',
      useClass: PermissionMySQLPersistence,
    }],
  exports: [],
})
export class MySQLPermissionModule {}
