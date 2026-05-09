import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { AuthController } from '../../controllers/auth.controller';
import { PostgreSQLAuthPersistence } from '../../repositories/postgresql/persistence/postgresql.auth.persistence';
import { environments } from '../../../../../settings/environments/environments';
import { JwtModule } from '@nestjs/jwt';
import { PostgreSQLUserPersistence } from '../../../../users/infrastructure/repositories/postgresql/persistence/postgresql.user.persistence';
import { LoginUseCase } from '../../../application/usecases/login.usecase';
import { ValidateUserUseCase } from '../../../application/usecases/validate-user.usecase';
import { VerifyUserUseCase } from '../../../application/usecases/verify-user.usecase';
import { RefreshTokenUseCase } from '../../../application/usecases/refresh-token.usecase';
import { LogoutUseCase } from '../../../application/usecases/logout.usecase';

@Module({
  imports: [
    KafkaServiceModule,
    JwtModule.register({
      global: true,
      secret: environments.JWT_SECRET,
      signOptions: { expiresIn: '1h', algorithm: 'HS256' },
    })],
  controllers: [AuthController],
  providers: [
    
    LoginUseCase,
    ValidateUserUseCase,
    VerifyUserUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    {
      provide: 'AuthRepository',
      useClass: PostgreSQLAuthPersistence,
    },
    {
      provide: 'UserRepository',
      useClass: PostgreSQLUserPersistence,
    }],
  exports: [],
})
export class PostgresqlAuthModule {}
