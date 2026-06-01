import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { PostgreSQLCustomerPersistence } from '../../repositories/postgresql/persistence/postgresql.customer.persistence';
import { PostgreSQLVerificationPersistence } from '../../repositories/postgresql/persistence/postgresql.verification.persistence';
import { CreateCustomerUseCase } from '../../../application/usecases/create-customer.usecase';
import { FindCustomerUseCase } from '../../../application/usecases/find-customer.usecase';
import { UpdateCustomerUseCase } from '../../../application/usecases/update-customer.usecase';
import { DeleteCustomerUseCase } from '../../../application/usecases/delete-customer.usecase';
import { SendVerificationCodeUseCase } from '../../../application/usecases/send-verification-code.usecase';
import { VerifyAccountByCodeUseCase } from '../../../application/usecases/verify-account-by-code.usecase';
import { CustomerController } from '../../controller/customer.controller';

@Module({
  imports: [KafkaServiceModule],
  controllers: [CustomerController],
  providers: [
    PostgreSQLCustomerPersistence,
    {
      provide: 'CustomerRepository',
      useClass: PostgreSQLCustomerPersistence,
    },
    PostgreSQLVerificationPersistence,
    {
      provide: 'VerificationRepository',
      useClass: PostgreSQLVerificationPersistence,
    },
    CreateCustomerUseCase,
    FindCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    SendVerificationCodeUseCase,
    VerifyAccountByCodeUseCase,
  ],
  exports: [
    CreateCustomerUseCase,
    FindCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    SendVerificationCodeUseCase,
    VerifyAccountByCodeUseCase,
  ],
})
export class PostgreSQLCustomerModule {}

