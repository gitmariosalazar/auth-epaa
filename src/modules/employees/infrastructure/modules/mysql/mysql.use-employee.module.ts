import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { UserEmployeeController } from '../../controller/user-employee.controller';
import { CreateEmployeeUseCase } from '../../../application/usecases/create-employee.usecase';
import { FindEmployeeUseCase } from '../../../application/usecases/find-employee.usecase';
import { UpdateEmployeeUseCase } from '../../../application/usecases/update-employee.usecase';
import { AssignEmployeeZonesUseCase } from '../../../application/usecases/assign-employee-zones.usecase';
import { ChangeEmployeeStatusUseCase } from '../../../application/usecases/change-employee-status.usecase';
import { ChangeEmployeeSupervisorUseCase } from '../../../application/usecases/change-employee-supervisor.usecase';
import { DeleteEmployeeUseCase } from '../../../application/usecases/delete-employee.usecase';
import { RestoreEmployeeUseCase } from '../../../application/usecases/restore-employee.usecase';
import { MySQLUserEmployeePersistence } from '../../repositories/mysql/persistence/mysql.user-employee.persistence';

@Module({
  imports: [KafkaServiceModule],
  controllers: [UserEmployeeController],
  providers: [
    
    CreateEmployeeUseCase,
    FindEmployeeUseCase,
    UpdateEmployeeUseCase,
    AssignEmployeeZonesUseCase,
    ChangeEmployeeStatusUseCase,
    ChangeEmployeeSupervisorUseCase,
    DeleteEmployeeUseCase,
    RestoreEmployeeUseCase,
    {
      provide: 'UserEmployeeRepository',
      useClass: MySQLUserEmployeePersistence,
    }],
  exports: [],
})
export class MySQLUserEmployeeModule {}
