import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateCustomerRequest } from '../../domain/schemas/dto/request/create.customer.request';
import { UpdateCustomerRequest } from '../../domain/schemas/dto/request/update.customer.request';
import { CustomerResponse } from '../../domain/schemas/dto/response/customer.response';
import { CreateCustomerUseCase } from '../../application/usecases/create-customer.usecase';
import { FindCustomerUseCase } from '../../application/usecases/find-customer.usecase';
import { UpdateCustomerUseCase } from '../../application/usecases/update-customer.usecase';
import { DeleteCustomerUseCase } from '../../application/usecases/delete-customer.usecase';
import { SendVerificationCodeUseCase } from '../../application/usecases/send-verification-code.usecase';
import { VerifyAccountByCodeUseCase } from '../../application/usecases/verify-account-by-code.usecase';
import { CustomerDomainException } from '../../domain/exceptions/customer.exceptions';
import { statusCode } from '../../../../settings/environments/status-code';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findCustomerUseCase: FindCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
    private readonly sendVerificationCodeUseCase: SendVerificationCodeUseCase,
    private readonly verifyAccountByCodeUseCase: VerifyAccountByCodeUseCase,
  ) {}

  private handleException(error: any): never {
    if (error instanceof CustomerDomainException) {
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

  @MessagePattern('authentication.customer.find_by_id')
  async findById(@Payload() customerUserId: string): Promise<CustomerResponse | null> {
    try {
      return await this.findCustomerUseCase.findById(customerUserId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.customer.find_by_client_id')
  async findByClientId(@Payload() clientId: string): Promise<CustomerResponse | null> {
    try {
      return await this.findCustomerUseCase.findByClientId(clientId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.customer.find_by_email')
  async findByEmail(@Payload() email: string): Promise<CustomerResponse | null> {
    try {
      return await this.findCustomerUseCase.findByEmail(email);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.customer.create')
  async create(@Payload() request: CreateCustomerRequest): Promise<CustomerResponse> {
    try {
      return await this.createCustomerUseCase.execute(request);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.customer.update')
  async update(
    @Payload() payload: { customerUserId: string; updates: UpdateCustomerRequest },
  ): Promise<CustomerResponse | null> {
    try {
      return await this.updateCustomerUseCase.execute(payload.customerUserId, payload.updates);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.customer.soft_delete')
  async softDelete(@Payload() customerUserId: string): Promise<void> {
    try {
      await this.deleteCustomerUseCase.softDelete(customerUserId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.customer.restore')
  async restore(@Payload() customerUserId: string): Promise<CustomerResponse | null> {
    try {
      return await this.deleteCustomerUseCase.restore(customerUserId);
    } catch (error) {
      this.handleException(error);
    }
  }

  @MessagePattern('authentication.customer.find_all')
  async findAll(
    @Payload() payload: { limit: number; offset: number },
  ): Promise<CustomerResponse[]> {
    try {
      return await this.findCustomerUseCase.findAll(payload.limit, payload.offset);
    } catch (error) {
      this.handleException(error);
    }
  }

  // ── Verificación de cuenta ──────────────────────────────────────────────────

  /**
   * Genera y envía un código de verificación por email o teléfono.
   * Se llama automáticamente tras el registro y también desde resend.
   */
  @MessagePattern('authentication.customer.send_verification_code')
  async sendVerificationCode(
    @Payload() payload: { clienteUsuarioId: string; tipoCodigo: 'EMAIL_CODE' | 'PHONE_CODE'; ipSolicitud?: string },
  ): Promise<void> {
    try {
      await this.sendVerificationCodeUseCase.execute(
        payload.clienteUsuarioId,
        payload.tipoCodigo,
        payload.ipSolicitud,
      );
    } catch (error) {
      this.handleException(error);
    }
  }

  /**
   * Valida el código ingresado por el usuario.
   * Si es correcto activa la cuenta (email_verified=true, status=1).
   */
  @MessagePattern('authentication.customer.verify_code')
  async verifyCode(
    @Payload() payload: { clienteUsuarioId: string; codigo: string; tipoCodigo: string },
  ): Promise<{ verified: boolean; message: string }> {
    try {
      return await this.verifyAccountByCodeUseCase.execute(
        payload.clienteUsuarioId,
        payload.codigo,
        payload.tipoCodigo,
      );
    } catch (error) {
      this.handleException(error);
    }
  }

  /**
   * Reenvío explícito del código (el usuario no lo recibió).
   * Reutiliza SendVerificationCodeUseCase — invalida el anterior y genera uno nuevo.
   */
  @MessagePattern('authentication.customer.resend_verification_code')
  async resendVerificationCode(
    @Payload() payload: { clienteUsuarioId: string; tipoCodigo: 'EMAIL_CODE' | 'PHONE_CODE'; ipSolicitud?: string },
  ): Promise<void> {
    try {
      await this.sendVerificationCodeUseCase.execute(
        payload.clienteUsuarioId,
        payload.tipoCodigo,
        payload.ipSolicitud,
      );
    } catch (error) {
      this.handleException(error);
    }
  }
}
