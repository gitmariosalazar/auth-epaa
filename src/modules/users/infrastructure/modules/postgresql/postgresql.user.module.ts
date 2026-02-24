import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { UserController } from '../../controllers/user.controller';
import { DatabaseServicePostgreSQL } from '../../../../../shared/connections/database/postgresql/postgresql.service';
import { PostgreSQLUserPersistence } from '../../repositories/postgresql/persistence/postgresql.user.persistence';
import { CreateUserUseCase } from '../../../application/usecases/create-user.usecase';
import { FindUserUseCase } from '../../../application/usecases/find-user.usecase';
import { AuthUserUseCase } from '../../../application/usecases/auth.usecase';
import { UpdateUserUseCase } from '../../../application/usecases/update-user.usecase';
import { BcryptEncryptionService } from '../../adapters/bcrypt.encryption.service';
import { AssignRoleToUserUseCase } from '../../../application/usecases/asign-role-to-user.usecase';
import { AssignPermissionToUserUseCase } from '../../../application/usecases/asign-permission-to-user.usecase';
import { PermissionPostgreSQLPersistence } from '../../../../permissions/infrastructure/repositories/persistence/postgresql.permission.persistence';
import { RolPostgreSQLPersistence } from '../../../../roles/infrastructure/repositories/postgresql/persistence/postgresql.rol.persistence';

@Module({
  imports: [KafkaServiceModule],
  controllers: [UserController],
  providers: [
    DatabaseServicePostgreSQL,
    CreateUserUseCase,
    FindUserUseCase,
    AuthUserUseCase,
    UpdateUserUseCase,
    BcryptEncryptionService,
    AssignRoleToUserUseCase,
    AssignPermissionToUserUseCase,
    {
      provide: 'EncryptionService',
      useClass: BcryptEncryptionService,
    },
    {
      provide: 'UserRepository',
      useClass: PostgreSQLUserPersistence,
    },
    {
      provide: 'PermissionRepository',
      useClass: PermissionPostgreSQLPersistence,
    },
    {
      provide: 'RolRepository',
      useClass: RolPostgreSQLPersistence,
    },
  ],
  exports: [],
})
export class PostgresqlUserModule {}
