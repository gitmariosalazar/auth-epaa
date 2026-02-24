import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { CategoryController } from '../../controllers/category.controller';
import { DatabaseServicePostgreSQL } from '../../../../../shared/connections/database/postgresql/postgresql.service';
import { CreateCategoryUseCase } from '../../../application/usecases/create-category.usecase';
import { FindCategoryUseCase } from '../../../application/usecases/find-category.usecase';
import { UpdateCategoryUseCase } from '../../../application/usecases/update-category.usecase';
import { DeleteCategoryUseCase } from '../../../application/usecases/delete-category.usecase';
import { CategoryPostgreSQLPersistence } from '../../repositories/postgresql/persistence/postgresql.category.persistence';

@Module({
  imports: [KafkaServiceModule],
  controllers: [CategoryController],
  providers: [
    DatabaseServicePostgreSQL,
    CreateCategoryUseCase,
    FindCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    {
      provide: 'CategoryRepository',
      useClass: CategoryPostgreSQLPersistence,
    },
  ],
})
export class PostgresqlCategoryModule {}
