import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { AuthController } from '../../controllers/auth.controller';
import { environments } from '../../../../../settings/environments/environments';
import { JwtModule } from '@nestjs/jwt';
import { LoginUseCase } from '../../../application/usecases/login.usecase';
import { ValidateUserUseCase } from '../../../application/usecases/validate-user.usecase';
import { VerifyUserUseCase } from '../../../application/usecases/verify-user.usecase';
import { RefreshTokenUseCase } from '../../../application/usecases/refresh-token.usecase';
import { LogoutUseCase } from '../../../application/usecases/logout.usecase';
import { MySQLAuthPersistence } from '../../repositories/mysql/persistence/mysql.auth.persistence';
import { MySQLUserPersistence } from '../../../../users/infrastructure/repositories/mysql/persistence/mysql.user.persistence';
import { ClientLoginUseCase } from '../../../application/usecases/client-login.usecase';
import { MySQLClientAuthPersistence } from '../../repositories/mysql/persistence/mysql.client-auth.persistence';

@Module({
  imports: [
    KafkaServiceModule,
    JwtModule.register({
      global: true,
      secret: environments.JWT_SECRET,
      signOptions: { expiresIn: '1h', algorithm: 'HS256' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    ValidateUserUseCase,
    VerifyUserUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    ClientLoginUseCase,
    {
      provide: 'AuthRepository',
      useClass: MySQLAuthPersistence,
    },
    {
      provide: 'UserRepository',
      useClass: MySQLUserPersistence,
    },
    {
      provide: 'ClientAuthRepository',
      useClass: MySQLClientAuthPersistence,
    },
  ],
  exports: [],
})
export class MySQLAuthModule {}
