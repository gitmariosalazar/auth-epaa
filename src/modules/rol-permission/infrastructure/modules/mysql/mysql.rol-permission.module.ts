import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { RolPermissionController } from '../../controllers/rol-permission.controller';
import { CreateRolPermissionUseCase } from '../../../application/usecases/create-rol-permission.usecase';
import { FindRolPermissionUseCase } from '../../../application/usecases/find-rol-permission.usecase';
import { UpdateRolPermissionUseCase } from '../../../application/usecases/update-rol-permission.usecase';
import { DeleteRolPermissionUseCase } from '../../../application/usecases/delete-rol-permission.usecase';
import { AssignPermissionsBatchUseCase } from '../../../application/usecases/assign-permissions-batch.usecase';
import { RolPermissionMySQLPersistence } from '../../repositories/mysql/persistence/mysql.rol-permission.persistence';

@Module({
  imports: [KafkaServiceModule],
  controllers: [RolPermissionController],
  providers: [
    CreateRolPermissionUseCase,
    FindRolPermissionUseCase,
    UpdateRolPermissionUseCase,
    DeleteRolPermissionUseCase,
    AssignPermissionsBatchUseCase,
    {
      provide: 'RolPermissionRepository',
      useClass: RolPermissionMySQLPersistence,
    },
  ],
  exports: [
    CreateRolPermissionUseCase,
    FindRolPermissionUseCase,
    UpdateRolPermissionUseCase,
    DeleteRolPermissionUseCase,
    AssignPermissionsBatchUseCase,
  ],
})
export class MySQLRolPermissionModule {}
