import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { RolController } from '../../controllers/rol.controller';
import { CreateRolUseCase } from '../../../application/usecases/create-rol.usecase';
import { FindRolUseCase } from '../../../application/usecases/find-rol.usecase';
import { UpdateRolUseCase } from '../../../application/usecases/update-rol.usecase';
import { RolPostgreSQLPersistence } from '../../repositories/postgresql/persistence/postgresql.rol.persistence';
import { PositionController } from '../../controllers/position.controller';
import { CreatePositionUseCase } from '../../../application/usecases/create-position.usecase';
import { FindPositionUseCase } from '../../../application/usecases/find-position.usecase';
import { UpdatePositionUseCase } from '../../../application/usecases/update-position.usecase';
import { DisablePositionUseCase } from '../../../application/usecases/disable-position.usecase';
import { PostgreSQLPositionPersistence } from '../../repositories/postgresql/persistence/postgresql.position.persistence';

@Module({
  imports: [KafkaServiceModule],
  controllers: [RolController, PositionController],
  providers: [
    CreateRolUseCase,
    FindRolUseCase,
    UpdateRolUseCase,
    {
      provide: 'RolRepository',
      useClass: RolPostgreSQLPersistence,
    },
    CreatePositionUseCase,
    FindPositionUseCase,
    UpdatePositionUseCase,
    DisablePositionUseCase,
    {
      provide: 'PositionRepository',
      useClass: PostgreSQLPositionPersistence,
    },
  ],
  exports: [],
})
export class PostgreSQLRolModule {}
