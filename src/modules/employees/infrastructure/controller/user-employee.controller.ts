import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateUserEmployeeRequest } from '../../domain/schemas/dto/request/create.user-employee.request';
import { UpdateUserEmployeeRequest } from '../../domain/schemas/dto/request/update.user-employee.request';
import { UserEmployeeResponse } from '../../domain/schemas/dto/response/user-employee.response';
import { CreateEmployeeUseCase } from '../../application/usecases/create-employee.usecase';
import { FindEmployeeUseCase } from '../../application/usecases/find-employee.usecase';
import { UpdateEmployeeUseCase } from '../../application/usecases/update-employee.usecase';
import { AssignEmployeeZonesUseCase } from '../../application/usecases/assign-employee-zones.usecase';
import { ChangeEmployeeStatusUseCase } from '../../application/usecases/change-employee-status.usecase';
import { ChangeEmployeeSupervisorUseCase } from '../../application/usecases/change-employee-supervisor.usecase';
import { DeleteEmployeeUseCase } from '../../application/usecases/delete-employee.usecase';
import { RestoreEmployeeUseCase } from '../../application/usecases/restore-employee.usecase';
import { EmployeeDomainException } from '../../domain/exceptions/employee.exceptions';
import { statusCode } from '../../../../settings/environments/status-code';

@Controller('user-employee')
export class UserEmployeeController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly findEmployeeUseCase: FindEmployeeUseCase,
    private readonly updateEmployeeUseCase: UpdateEmployeeUseCase,
    private readonly assignEmployeeZonesUseCase: AssignEmployeeZonesUseCase,
    private readonly changeEmployeeStatusUseCase: ChangeEmployeeStatusUseCase,
    private readonly changeEmployeeSupervisorUseCase: ChangeEmployeeSupervisorUseCase,
    private readonly deleteEmployeeUseCase: DeleteEmployeeUseCase,
    private readonly restoreEmployeeUseCase: RestoreEmployeeUseCase,
  ) {}

  private handleException(error: any): never {
    if (error instanceof EmployeeDomainException) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: error.message,
      });
    }
    if (error instanceof RpcException) throw error;

    throw new RpcException({
      statusCode: statusCode.INTERNAL_SERVER_ERROR,
      message: error.message || 'Internal server error',
    });
  }

  // =============================================
  // Búsquedas básicas
  // =============================================

  @MessagePattern('authentication.user-employee.find_by_id')
  async findById(
    @Payload() employeeId: string,
  ): Promise<UserEmployeeResponse | null> {
    try {
      return await this.findEmployeeUseCase.findById(employeeId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.user-employee.find_by_user_id')
  async findByUserId(
    @Payload() userId: string,
  ): Promise<UserEmployeeResponse | null> {
    try {
      return await this.findEmployeeUseCase.findByUserId(userId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.user-employee.find_by_id_card')
  async findByIdCard(
    @Payload() idCard: string,
  ): Promise<UserEmployeeResponse | null> {
    try {
      return await this.findEmployeeUseCase.findByIdCard(idCard);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.user-employee.search_by_name')
  async searchByName(
    @Payload() searchTerm: string,
  ): Promise<UserEmployeeResponse[]> {
    try {
      return await this.findEmployeeUseCase.searchByName(searchTerm);
    } catch (error) {
      this.handleException(error);
    }
  }

  // =============================================
  // Verificación de existencia
  // =============================================

  @MessagePattern('authentication.user-employee.exists_by_user_id')
  async existsByUserId(@Payload() userId: string): Promise<boolean> {
    try {
      return await this.findEmployeeUseCase.existsByUserId(userId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.user-employee.exists_by_id_card')
  async existsByIdCard(@Payload() idCard: string): Promise<boolean> {
    try {
      return await this.findEmployeeUseCase.existsByIdCard(idCard);
    } catch (error) {
      this.handleException(error);
    }
  }

  // =============================================
  // CRUD completo
  // =============================================

  @MessagePattern('authentication.user-employee.create')
  async create(
    @Payload() request: CreateUserEmployeeRequest,
  ): Promise<UserEmployeeResponse> {
    try {
      return await this.createEmployeeUseCase.execute(request);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.user-employee.update')
  async update(
    @Payload()
    payload: {
      employeeId: string;
      updates: UpdateUserEmployeeRequest;
    },
  ): Promise<UserEmployeeResponse | null> {
    try {
      return await this.updateEmployeeUseCase.update(
        payload.employeeId,
        payload.updates,
      );
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.user-employee.soft_delete')
  async softDelete(@Payload() employeeId: string): Promise<void> {
    try {
      await this.deleteEmployeeUseCase.execute(employeeId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.user-employee.restore')
  async restore(
    @Payload() employeeId: string,
  ): Promise<UserEmployeeResponse | null> {
    try {
      return await this.restoreEmployeeUseCase.execute(employeeId);
    } catch (error) {
      this.handleException(error);
    }
  }

  // =============================================
  // Operaciones de negocio específicas
  // =============================================

  @MessagePattern('authentication.user-employee.assign_zones')
  async assignZones(
    @Payload() payload: { employeeId: string; zoneIds: number[] },
  ): Promise<void> {
    try {
      await this.assignEmployeeZonesUseCase.execute(
        payload.employeeId,
        payload.zoneIds,
      );
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.user-employee.change_status')
  async changeStatus(
    @Payload() payload: { employeeId: string; newStatusId: number },
  ): Promise<UserEmployeeResponse | null> {
    try {
      return await this.changeEmployeeStatusUseCase.execute(
        payload.employeeId,
        payload.newStatusId,
      );
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.user-employee.change_supervisor')
  async changeSupervisor(
    @Payload() payload: { employeeId: string; supervisorId: string | null },
  ): Promise<UserEmployeeResponse | null> {
    try {
      return await this.changeEmployeeSupervisorUseCase.execute(
        payload.employeeId,
        payload.supervisorId,
      );
    } catch (error) {
      this.handleException(error);
    }
  }

  // =============================================
  // Listados y filtros avanzados
  // =============================================

  @MessagePattern('authentication.user-employee.find_all_active')
  async findAllActive(): Promise<UserEmployeeResponse[]> {
    try {
      return await this.findEmployeeUseCase.findAllActive();
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.user-employee.find_by_position')
  async findByPosition(
    @Payload() positionId: number,
  ): Promise<UserEmployeeResponse[]> {
    try {
      return await this.findEmployeeUseCase.findByPosition(positionId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.user-employee.find_by_zone')
  async findByZone(@Payload() zoneId: number): Promise<UserEmployeeResponse[]> {
    try {
      return await this.findEmployeeUseCase.findByZone(zoneId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.user-employee.find_by_supervisor')
  async findBySupervisor(
    @Payload() supervisorId: string,
  ): Promise<UserEmployeeResponse[]> {
    try {
      return await this.findEmployeeUseCase.findBySupervisor(supervisorId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.user-employee.find_all_employees')
  async findAllEmployees(
    @Payload() payload: { limit: number; offset: number },
  ): Promise<UserEmployeeResponse[]> {
    try {
      return await this.findEmployeeUseCase.findAllEmployees(
        payload.limit,
        payload.offset,
      );
    } catch (error) {
      this.handleException(error);
    }
  }
}
