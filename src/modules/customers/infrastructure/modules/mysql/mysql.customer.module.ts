import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { MySQLCustomerPersistence } from '../../repositories/mysql/persistence/mysql.customer.persistence';
import { CreateCustomerUseCase } from '../../../application/usecases/create-customer.usecase';
import { FindCustomerUseCase } from '../../../application/usecases/find-customer.usecase';
import { UpdateCustomerUseCase } from '../../../application/usecases/update-customer.usecase';
import { DeleteCustomerUseCase } from '../../../application/usecases/delete-customer.usecase';
import { CustomerController } from '../../controller/customer.controller';
import { MySQLVerificationPersistence } from '../../repositories/mysql/persistence/mysql.verification.persistence';
import { VerifyAccountByCodeUseCase } from '../../../application/usecases/verify-account-by-code.usecase';
import { SendVerificationCodeUseCase } from '../../../application/usecases/send-verification-code.usecase';

@Module({
  imports: [KafkaServiceModule],
  controllers: [CustomerController],
  providers: [
    MySQLCustomerPersistence,
    {
      provide: 'CustomerRepository',
      useClass: MySQLCustomerPersistence,
    },
    {
      provide: 'VerificationRepository',
      useClass: MySQLVerificationPersistence,
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
export class MySQLCustomerModule {}
