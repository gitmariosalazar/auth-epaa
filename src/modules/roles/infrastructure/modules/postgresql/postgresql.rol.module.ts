import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { RolController } from '../../controllers/rol.controller';
import { CreateRolUseCase } from '../../../application/usecases/create-rol.usecase';
import { FindRolUseCase } from '../../../application/usecases/find-rol.usecase';
import { UpdateRolUseCase } from '../../../application/usecases/update-rol.usecase';
import { RolPostgreSQLPersistence } from '../../repositories/postgresql/persistence/postgresql.rol.persistence';

@Module({
  imports: [KafkaServiceModule],
  controllers: [RolController],
  providers: [
    
    CreateRolUseCase,
    FindRolUseCase,
    UpdateRolUseCase,
    {
      provide: 'RolRepository',
      useClass: RolPostgreSQLPersistence,
    }],
  exports: [],
})
export class PostgreSQLRolModule {}
