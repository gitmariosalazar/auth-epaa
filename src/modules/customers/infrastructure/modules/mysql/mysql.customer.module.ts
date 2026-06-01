import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { MySQLCustomerPersistence } from '../../repositories/mysql/persistence/mysql.customer.persistence';
import { CreateCustomerUseCase } from '../../../application/usecases/create-customer.usecase';
import { FindCustomerUseCase } from '../../../application/usecases/find-customer.usecase';
import { UpdateCustomerUseCase } from '../../../application/usecases/update-customer.usecase';
import { DeleteCustomerUseCase } from '../../../application/usecases/delete-customer.usecase';
import { CustomerController } from '../../controller/customer.controller';

@Module({
  imports: [KafkaServiceModule],
  controllers: [CustomerController],
  providers: [
    MySQLCustomerPersistence,
    {
      provide: 'CustomerRepository',
      useClass: MySQLCustomerPersistence,
    },
    CreateCustomerUseCase,
    FindCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
  ],
  exports: [
    CreateCustomerUseCase,
    FindCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
  ],
})
export class MySQLCustomerModule {}
