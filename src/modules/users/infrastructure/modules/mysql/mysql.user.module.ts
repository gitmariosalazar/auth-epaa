import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { UserController } from '../../controllers/user.controller';
import { CreateUserUseCase } from '../../../application/usecases/create-user.usecase';
import { FindUserUseCase } from '../../../application/usecases/find-user.usecase';
import { AuthUserUseCase } from '../../../application/usecases/auth.usecase';
import { UpdateUserUseCase } from '../../../application/usecases/update-user.usecase';
import { BcryptEncryptionService } from '../../adapters/bcrypt.encryption.service';
import { AssignRoleToUserUseCase } from '../../../application/usecases/asign-role-to-user.usecase';
import { AssignPermissionToUserUseCase } from '../../../application/usecases/asign-permission-to-user.usecase';
import { SetPinUseCase } from '../../../application/usecases/set-pin.usecase';

import { RolMySQLPersistence } from '../../../../roles/infrastructure/repositories/mysql/persistence/mysql.rol.persistence';
import { PermissionMySQLPersistence } from '../../../../permissions/infrastructure/repositories/mysql/persistence/mysql.permission.persistence';
import { MySQLUserPersistence } from '../../repositories/mysql/persistence/mysql.user.persistence';

@Module({
  imports: [KafkaServiceModule],
  controllers: [UserController],
  providers: [
    
    CreateUserUseCase,
    FindUserUseCase,
    AuthUserUseCase,
    UpdateUserUseCase,
    BcryptEncryptionService,
    AssignRoleToUserUseCase,
    AssignPermissionToUserUseCase,
    SetPinUseCase,
    {
      provide: 'EncryptionService',
      useClass: BcryptEncryptionService,
    },
    {
      provide: 'UserRepository',
      useClass: MySQLUserPersistence,
    },
    {
      provide: 'PermissionRepository',
      useClass: PermissionMySQLPersistence,
    },
    {
      provide: 'RolRepository',
      useClass: RolMySQLPersistence,
    }],
  exports: [],
})
export class MySQLUserModule {}
